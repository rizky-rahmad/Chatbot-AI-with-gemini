// ============================================================================
// IMPORTS & DEPENDENCIES
// ============================================================================
import express from "express"; // Main framework for building the HTTP web server
import "dotenv/config"; // Automatically loads environment variables from a .env file
import { GoogleGenAI } from "@google/genai"; // Official Google SDK for Gemini AI
import multer from "multer"; // Middleware for handling multipart/form-data (file uploads)
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing
import path from "path"; // Node.js built-in module for file/directory paths
import { fileURLToPath } from "url"; // Utility to convert module URLs to local file paths
import rateLimit from "express-rate-limit"; // Security middleware to limit repeated requests

// ============================================================================
// INITIALIZATION & BASIC SECURITY
// ============================================================================

// FAIL-FAST: Crucial check at startup. Shut down the server immediately if API key is missing.
// This prevents the application from running in a broken state.
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GOOGLE_API_KEY is not defined in the .env file.");
  process.exit(1);
}

// Create an instance of the Express application
const app = express();
// Define the server port. Use the environment variable if available, otherwise fallback to 3000
const port = process.env.PORT || 3000;

// Initialize the Gemini AI client with the verified API Key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
// Define the Gemini model to be used globally
const GEMINI_MODEL = "gemini-2.5-flash";

// ============================================================================
// MIDDLEWARE CONFIGURATION (SPAM PREVENTION & FILE HANDLING)
// ============================================================================

// Multer configuration for handling file uploads in memory (buffer).
// LIMITATION: Capped at 5MB per file to prevent users from uploading massive files
// that could cause the server to run out of RAM (Out of Memory error).
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB (in bytes)
});

// Rate Limiter configuration to protect the API from light DDoS attacks or spamming.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Duration: 15 minutes
  max: 100, // Max limit: 100 requests per IP within the duration
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

// Register middlewares in Express
app.use(express.json()); // Allows Express to parse JSON request bodies
app.use(cors()); // Enables cross-origin requests
app.use("/api/", limiter); // Applies the rate limiter ONLY to routes starting with "/api/"

// ============================================================================
// STATIC FOLDER SETUP (FRONTEND)
// ============================================================================

// ES Modules workaround to get the current directory path (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static HTML, CSS, JS files located in the "public" folder for direct browser access
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// API ENDPOINTS (ROUTES)
// ============================================================================

/**
 * 1. ENDPOINT: Generate Text
 * Purpose: Receives a standard text prompt and returns the AI's text response.
 */
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body; // Extract the "prompt" data from the request body

  // Input Validation
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required and must be a valid string!" });
  }

  try {
    // Request the AI to generate content based on the prompt
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    
    // Return the result (text) with HTTP status 200 (OK)
    res.status(200).json({ result: response.text });
  } catch (error) {
    // Log the error on the server side for developer debugging
    console.error("[generate-text Error]:", error.message);
    // Return a generic error message to the user to avoid leaking system details
    res.status(500).json({ message: "Internal server error occurred." }); 
  }
});

/**
 * 2. ENDPOINT: Generate from Image
 * Purpose: Analyzes an uploaded image along with text instructions (prompt).
 * Middleware `upload.single("image")` intercepts the file with the key "image" before it reaches the handler.
 */
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;

  // File Validation: Ensure the user actually uploaded a file
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required!" });
  }
  // Prompt Validation
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ message: "Prompt is required and must be a valid string!" });
  }

  try {
    // Convert the image file in RAM (buffer) to a Base64 string to send to the Gemini API
    const base64Image = req.file.buffer.toString("base64");
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      // Specific format required when sending a combination of text and media
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } }, // Send base64 along with its file type (e.g., image/jpeg)
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("[generate-from-image Error]:", error.message);
    res.status(500).json({ message: "Internal server error occurred." });
  }
});

/**
 * 3. ENDPOINT: Generate from Document
 * Purpose: Reads and analyzes a document (PDF, etc.). Similar to the image endpoint.
 */
app.post("/generate-from-doc", upload.single("document"), async (req, res) => {
  const { prompt } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Document file is required!" });
  }

  try {
    const base64Document = req.file.buffer.toString("base64");
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        // Use logical OR. If prompt is empty, use a default instruction
        { text: prompt || "Please summarize the following document", type: "text" },
        { inlineData: { data: base64Document, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("[generate-from-doc Error]:", error.message);
    res.status(500).json({ message: "Internal server error occurred." });
  }
});

/**
 * 4. ENDPOINT: Multi-Turn Chat (Main Chatbot Application)
 * Purpose: Handles back-and-forth conversations. Receives chat history to give the AI context.
 */
app.post("/api/chat", async (req, res) => {
  const { conversation } = req.body; // Receive an array of objects containing history (role & text)

  try {
    // Validation: Ensure data is an array and not empty
    if (!Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({ message: "Conversation format must be a non-empty array!" });
    }

    // Map/format the history from the frontend to match the Gemini API's expected format
    const contents = conversation.map(({ role, text }) => ({
      role, // 'user' or 'model' (bot)
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents, // Insert the formatted history array here
      config: {
        // Temperature controls the model's creativity/randomness (0.0 is very strict, 1.0 is very creative/imaginative)
        // 0.7 is a balanced number for an assistant chatbot
        temperature: 0.7, 
        // System Instruction that the AI will follow throughout the conversation
        systemInstruction: "answer in a professional style ",
      },
    });

    res.status(200).json({ result: response.text });
  } catch (error) {
    console.error("[api/chat Error]:", error.message);
    res.status(500).json({ message: "An error occurred on the server while processing the chat." });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

// Run the server on the specified port and print a log upon success
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); 
});
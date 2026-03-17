```markdown
<div align="center">

# 🤖 Gemini AI Chatbot

A modern, production-ready AI Chatbot application built with Node.js, Express, and the Google Gemini API. Features a clean, responsive UI powered by Tailwind CSS.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](#)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey?style=for-the-badge&logo=express)](#)
[![Google Gemini](https://img.shields.io/badge/Gemini_API-2.5_Flash-blue?style=for-the-badge&logo=google)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#)

</div>

<br />

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Security & Rate Limiting](#-security--rate-limiting)
- [License](#-license)

---

## 🌟 Features

- **💬 Context-Aware Chat:** Multi-turn conversations that remember previous message history.
- **🎨 Modern UI/UX:** Responsive design built with Tailwind CSS, featuring Flexbox message alignment and smooth scroll animations.
- **🖼️ Multimodal Capabilities:** - Standard text generation.
  - Image analysis and content generation.
  - Document (e.g., PDF) summarization and analysis.
- **🛡️ Production-Ready Security:** Built-in rate limiting and strict file upload size constraints.

## 💻 Tech Stack

- **Backend:** Node.js, Express.js
- **AI Integration:** `@google/genai` (Google Gemini 2.5 Flash)
- **Frontend:** HTML5, JavaScript, Tailwind CSS (via CDN)
- **Middleware:** `multer` (File handling), `cors`, `express-rate-limit`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- A valid [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd chatbot-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `GOOGLE_API_KEY` | `string` | **Required** | Your personal Google Gemini API Key. |
| `PORT` | `number` | `3000` | The port on which the server will run. |

*Example `.env` file:*
```env
GOOGLE_API_KEY=AIzaSyYourSecretAPIKeyHere...
PORT=3000
```

### Running the Application

Start the development server:
```bash
node index.js
```

The application will be available at **http://localhost:3000**.

---

## 📡 API Reference

The backend provides several RESTful endpoints for different AI tasks:

| Endpoint | Method | Payload Type | Description |
| :--- | :---: | :--- | :--- |
| `/api/chat` | `POST` | `application/json` | Accepts a `conversation` array and returns the AI's contextual response. |
| `/generate-text` | `POST` | `application/json` | Accepts a `prompt` string and returns AI-generated text. |
| `/generate-from-image`| `POST` | `multipart/form-data` | Accepts an `image` file and a `prompt` string. |
| `/generate-from-doc` | `POST` | `multipart/form-data` | Accepts a `document` file and an optional `prompt`. |

---

## 📂 Project Structure

```text
chatbot-ai/
├── public/                 # Static frontend assets
│   └── index.html          # Main Chat UI (HTML/Tailwind/JS)
├── .env                    # Environment configurations (ignored in git)
├── index.js                # Express server and API route definitions
├── package.json            # Project metadata and npm dependencies
└── README.md               # Project documentation
```

---

## 🛡️ Security & Rate Limiting

To ensure the application is production-ready and protected against abuse:
- **Rate Limiter:** Limits requests to `100 requests per 15 minutes` per IP address to prevent API spamming.
- **Memory Protection:** Uploads via `multer` are strictly capped at **5MB** to prevent Out-Of-Memory (OOM) crashes.
- **Fail-Fast Initialization:** The server actively checks for the `GOOGLE_API_KEY` on startup and will exit gracefully with a clear error if it is missing.
- **Error Masking:** Stack traces and internal API errors are logged to the console but masked from the client to prevent information leakage.

---
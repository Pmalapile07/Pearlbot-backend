require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Initialize Gemini AI (use environment variable or hardcode for testing)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAEI9xEmfub47xqu1IYljT_JQpydaCVIIk");

app.post('/chat', async (req, res) => {
  try {
    console.log("Received request:", req.body); // Log incoming requests
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      response: text,
      status: "success"
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      error: "An error occurred while processing your request",
      details: error.message,
      fullError: error // Only for development
    });
  }
});

// Health check endpoint with better response
app.get('/', (req, res) => {
  res.json({ 
    status: "running",
    message: "PearlBot Backend is operational",
    timestamp: new Date().toISOString()
  });
});

// Better error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
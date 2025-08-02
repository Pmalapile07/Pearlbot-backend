require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*' // Allow all origins (replace with your Shopify store URL in production)
}));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
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
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('PearlBot Backend is running!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
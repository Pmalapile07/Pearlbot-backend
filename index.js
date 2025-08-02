import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.AIzaSyAEI9xEmfub47xqu1IYljT_JQpydaCVIIk;

app.post("/chat", async (req, res) => {
  const userInput = req.body.message || "Hello from frontend";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userInput }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get a response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

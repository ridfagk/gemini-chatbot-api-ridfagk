import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});


// Route Penting
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await model.generateContent(message);
    const response = result.response;
    const text = await response.text();

    res.json({ reply: text });    
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Gemini chatbot is running on http://localhost:${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Quote = require('./models/Quote');
const { generateQuoteByMood } = require('./utils/aiClient');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('Mongo error:', err));

// Routes

// Submit user quote
app.post('/api/quotes', async (req, res) => {
  try {
    const { text, mood } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const quote = await Quote.create({
      text,
      mood: mood || "default",
      sourceType: "user"
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save quote" });
  }
});


// Get random quote (optionally by mood)
app.get('/api/quotes/random', async (req, res) => {
  try {
    const { mood } = req.query;
    const filter = mood ? { mood } : {};
    const count = await Quote.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ error: "No quotes found" });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const quote = await Quote.findOne(filter).skip(randomIndex);
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get random quote" });
  }
});

// AI-generated quote by mood
app.post('/api/quotes/ai-generate', async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) return res.status(400).json({ error: "Mood is required" });

    const text = await generateQuoteByMood(mood);

    const quote = await Quote.create({
      text,
      author: "AI",
      mood,
      sourceType: "ai"
    });

    res.status(201).json(quote);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to generate AI quote" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend listening on ${PORT}`));

const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "" },  // not really used
  mood: {
    type: String,
    enum: ["happy", "sad", "motivated", "calm", "stressed", "default"],
    default: "default"
  },
  sourceType: {
    type: String,
    enum: ["user", "ai"],
    default: "user"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);

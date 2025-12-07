// utils/aiClient.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateQuoteByMood(mood) {
  const prompt = `
You are an AI that generates short, original quotes.
Mood: ${mood}
Return ONLY the quote text, no emojis and no hashtags.
`;

  try {
    const response = await client.responses.create({
      model: "gpt-5-mini",   // or "gpt-4.1-mini" if you prefer
      input: prompt,
    });

    const text = response.output_text.trim();
    return text;
  } catch (err) {
    console.error("❌ OpenAI Error (generateQuoteByMood):", err.response?.data || err.message);
    return `Couldn't reach AI, but here's a ${mood} reminder: stay strong.`;
  }
}

module.exports = { generateQuoteByMood };

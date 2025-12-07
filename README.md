# 🧠 Mood-Based AI Quote Generator

An interactive full-stack application where users select a mood (happy, sad, motivated, calm, stressed), and the system:

- Generates **AI-powered quotes** using OpenAI
- Lets users **submit their own quotes**
- Stores all quotes in **MongoDB**
- Displays a “mood wall” showing one quote per mood

Built using **React (Vite)**, **Node.js**, **Express**, **MongoDB Atlas**, and the **OpenAI API**.

---

## ⚙️ Backend – Setup & Run

### 1. Install dependencies

bash
cd Backend
npm install
2. Configure environment variables
Create a file:

bash
Copy code
Backend/.env
Add the following:

ini
Copy code
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_secret_key
PORT=5000
🔹 MONGO_URI
You can use:

MongoDB Atlas (recommended)

or a local MongoDB instance

Example (Atlas):

ini
Copy code
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/mood_quotes?retryWrites=true&w=majority
🔹 OPENAI_API_KEY
Get it from:

OpenAI Dashboard → Settings → API Keys

Do NOT share this key or commit it to GitHub.

3. Start the backend server
bash
Copy code
cd Backend
npm run dev
Backend runs at:

arduino
Copy code
http://localhost:5000
🎨 Frontend – Setup & Run
1. Install dependencies
bash
Copy code
cd Frontend/frontend
npm install
2. Start the development server
bash
Copy code
npm run dev
Frontend runs at something like:

arduino
Copy code
http://localhost:5173
Ensure Backend API URL matches
Inside src/App.jsx:

js
Copy code
const API_BASE = "http://localhost:5000/api";
🔌 API Endpoints
All backend routes are available under:

bash
Copy code
http://localhost:5000/api
POST /quotes
Create a new user-submitted quote.

Request Body:
json
Copy code
{
  "text": "Your quote text here",
  "mood": "happy"
}
GET /quotes/random?mood=happy
Fetch a random stored quote for a specific mood.

POST /quotes/ai-generate
Generate an AI mood-based quote and store it.

Request Body:
json
Copy code
{
  "mood": "motivated"
}
Example Response:
json
Copy code
{
  "_id": "...",
  "text": "Even slow days push you forward if you keep moving.",
  "mood": "motivated",
  "sourceType": "ai",
  "createdAt": "2025-12-07T10:00:00.000Z"
}
🧠 OpenAI Integration (Backend)
Backend/utils/aiClient.js:

Uses the official OpenAI Node SDK (openai)

Calls client.responses.create() with a mood-specific prompt

Returns a short motivational quote

If an error occurs (quota exceeded, invalid key, network failure), the function returns a friendly fallback quote instead of crashing the app

This ensures the frontend will always display a message.

🔒 Environment & Security
.env is included in .gitignore (so it won’t be committed)

Never hardcode your OPENAI_API_KEY in JavaScript files

When deploying, use environment variable configuration provided by the host (Render, Railway, Vercel, Netlify)

🌐 Deployment (Ideas)
Backend → Render / Railway / Fly.io
Deploy the Backend folder as a Node service

Set environment variables:

ini
Copy code
MONGO_URI=...
OPENAI_API_KEY=...
After deployment you'll get a backend URL like:

arduino
Copy code
https://your-backend-service.onrender.com
Frontend → Netlify / Vercel
Deploy Frontend/frontend as a static site

Update API_BASE inside App.jsx:

js
Copy code
const API_BASE = "https://your-backend-service.onrender.com/api";
🧭 Future Improvements
🎨 Mood-specific color themes (UI background changes based on mood)

🧱 Quote history view for each mood

🔑 User authentication (login + personal quotes)

📤 Export quotes as images for Instagram or Reels

✨ Add animations (typewriter effect, fade-in quotes)
  

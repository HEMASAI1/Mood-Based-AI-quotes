Mood-Based AI Quote Generator

An interactive full-stack application where users select a mood (happy, sad, motivated, calm, stressed), and the system:

Generates AI-powered quotes using OpenAI

Lets users submit their own quotes

Stores all quotes in MongoDB

Displays a “mood wall” showing one quote per mood

Built using React (Vite), Node.js, Express, MongoDB Atlas, and the OpenAI API.

Backend – Setup & Run
1. Install dependencies
cd Backend
npm install

2. Configure environment variables

Create a file:

Backend/.env


Add the following:

MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_secret_key
PORT=5000

MONGO_URI

Use MongoDB Atlas or a local MongoDB instance.

Example (MongoDB Atlas):

MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/mood_quotes?retryWrites=true&w=majority

OPENAI_API_KEY

Get it from:

OpenAI Dashboard → Settings → API Keys

Do not share this key or commit it to GitHub.

3. Start the backend server
cd Backend
npm run dev


Backend runs at:

http://localhost:5000

Frontend – Setup & Run
1. Install dependencies
cd Frontend/frontend
npm install

2. Start the development server
npm run dev


The frontend runs at:

http://localhost:5173


Ensure the backend is running on port 5000, or update API_BASE in App.jsx:

const API_BASE = "http://localhost:5000/api";

API Endpoints

All backend routes are prefixed with:

http://localhost:5000/api

POST /quotes

Create a user-submitted quote.

Request body:

{
  "text": "Your quote text here",
  "mood": "happy"
}

GET /quotes/random?mood=happy

Fetch a random stored quote for a specific mood.

POST /quotes/ai-generate

Generate an AI quote based on mood and store it.

Request body:

{
  "mood": "motivated"
}


Example response:

{
  "_id": "...",
  "text": "Even slow days push you forward if you keep moving.",
  "mood": "motivated",
  "sourceType": "ai",
  "createdAt": "2025-12-07T10:00:00.000Z"
}

OpenAI Integration (Backend)

The file Backend/utils/aiClient.js:

Uses the official OpenAI Node SDK (openai)

Calls client.responses.create with a mood-specific prompt

Returns a short, original quote

Returns a fallback quote if the API request fails (quota exceeded, invalid key, network error, etc.)

Environment & Security

.env is ignored using .gitignore

Never hardcode your OPENAI_API_KEY

For deployment, configure environment variables in the hosting platform (Render, Railway, Vercel, etc.)

Deployment
Backend → Render / Railway / Fly.io

Deploy the Backend folder as a Node.js service.

Set these environment variables:

MONGO_URI=...
OPENAI_API_KEY=...

Frontend → Netlify / Vercel

Deploy Frontend/frontend as a static site.

Update API URL:

const API_BASE = "https://your-backend-service.onrender.com/api";

Future Improvements

Mood-specific color themes

Quote history for each mood

User authentication

Export quotes as images

Add animations

Notes

Backend must be running for the frontend to work

MongoDB Atlas must allow your IP

OpenAI API key must have active quota
  

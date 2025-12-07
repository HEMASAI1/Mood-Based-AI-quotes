import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";
const moods = ["sad", "happy", "motivated", "calm", "stressed"];

function App() {
  const [mood, setMood] = useState("motivated");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userText, setUserText] = useState("");

  // mood wall: { sad: "quote...", happy: "quote..." }
  const [moodWall, setMoodWall] = useState({});

  async function callApi(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
  }

  async function handleGenerateAI() {
    try {
      setLoading(true);
      setError("");
      const data = await callApi("/quotes/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      });
      setQuote(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRandomQuote() {
    try {
      setLoading(true);
      setError("");
      const data = await callApi(`/quotes/random?mood=${mood}`);
      setQuote(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitUserQuote(e) {
    e.preventDefault();
    if (!userText.trim()) return;

    try {
      setLoading(true);
      setError("");
      const data = await callApi("/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, mood })
      });
      setQuote(data);
      setUserText("");
      // refresh mood wall for this mood
      loadSingleMood(mood);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // helper: load 1 random quote for a mood (for the wall)
  async function loadSingleMood(m) {
    try {
      const data = await callApi(`/quotes/random?mood=${m}`);
      setMoodWall((prev) => ({ ...prev, [m]: data.text }));
    } catch {
      // if no quote for that mood yet, ignore
    }
  }

  // on first load, build the mood wall
  useEffect(() => {
    moods.forEach((m) => {
      loadSingleMood(m);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#f8f8f8",
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "95vw", // 🔹 take almost full screen width
          borderRadius: 24,
          border: "1px solid #333",
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          background:
            "linear-gradient(135deg, #111 0%, #151515 60%, #101010 100%)",
          display: "flex",
          gap: 24
        }}
      >
        {/* LEFT COLUMN: controls + main quote */}
        <div style={{ flex: 1 }}>
          <header style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 40 }}>🧠</span>
              <div>
                <h1 style={{ margin: 0, fontSize: 32 }}>
                  Mood-Based Quote Generator
                </h1>
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Choose your mood, let AI craft a quote, or pull one from the
                  vault.
                </p>
              </div>
            </div>
          </header>

          <section style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600 }}>
              Mood:&nbsp;
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #444",
                  backgroundColor: "#1b1b1b",
                  color: "#f8f8f8"
                }}
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                onClick={handleGenerateAI}
                disabled={loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #ff7a3c, #ff4b7a)",
                  color: "#fff",
                  fontWeight: 600
                }}
              >
                {loading ? "Thinking…" : "Generate AI Quote"}
              </button>
              <button
                onClick={handleRandomQuote}
                disabled={loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid #555",
                  backgroundColor: "#181818",
                  color: "#f8f8f8",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Random Stored Quote
              </button>
            </div>
          </section>

          {error && (
            <p style={{ color: "#ff6b6b", marginBottom: 12 }}>⚠ {error}</p>
          )}

          {quote && (
            <section
              style={{
                marginBottom: 24,
                padding: 18,
                borderRadius: 16,
                background:
                  "radial-gradient(circle at top left, #2c1c1c, #111)",
                border: "1px solid #333",
                minHeight: 90
              }}
            >
              <p style={{ fontSize: 22, marginBottom: 6 }}>
                “{quote.text}”
              </p>
              <p style={{ opacity: 0.7, fontSize: 13 }}>
                mood: <b>{quote.mood}</b> · source: <b>{quote.sourceType}</b>
              </p>
            </section>
          )}

          <section>
            <h2 style={{ marginBottom: 8 }}>Submit your own quote</h2>
            <form onSubmit={handleSubmitUserQuote}>
              <textarea
                placeholder="Your quote..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid #444",
                  backgroundColor: "#181818",
                  color: "#f8f8f8",
                  resize: "vertical"
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#ff7a3c",
                  color: "#050505",
                  fontWeight: 600
                }}
              >
                Save Quote
              </button>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: mood cards */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          {moods.map((m) => (
            <div
              key={m}
              style={{
                flex: 1,
                borderRadius: 16,
                border: "1px solid #333",
                padding: 14,
                backgroundColor: "#181818",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 70
              }}
            >
              <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                {m}
              </div>
              <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
                {moodWall[m]
                  ? `“${moodWall[m]}”`
                  : "No quote saved for this mood yet."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

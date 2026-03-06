"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function testAPI() {
    setLoading(true);

    try {
      // change back to "/api/run" when running in production
      const res = await fetch("http://localhost:5000/api/run");
      const data = await res.json();

      setResult(JSON.stringify(data));
    } catch (err) {
      setResult("API request failed");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>API Test</h1>

      <button onClick={testAPI}>Run Python API</button>

      {loading && <p>Running...</p>}

      {result && <pre>{result}</pre>}
    </main>
  );
}

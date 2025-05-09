import React, { useState } from "react";

const CheckAssignmentPage = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !name) {
      setError("Please enter both code and name.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/get-assignment/?code=${code}&name=${encodeURIComponent(
          name
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch assignment.");
      }

      const data = await response.json();
      setResult(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred.");
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Check Your Assignment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Code:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your draw code here"
          />
        </label>
        <br />
        <label>
          Your Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <br />
        <button type="submit">Check Assignment</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>Assignment Found!</h2>
          <p>
            <strong>{result.name}</strong> → You give a gift to{" "}
            <strong>{result.assigned_to}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckAssignmentPage;

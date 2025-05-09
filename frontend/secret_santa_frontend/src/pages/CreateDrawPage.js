import React, { useState } from "react";

const CreateDrawPage = () => {
  const [namesInput, setNamesInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const namesArray = namesInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (namesArray.length < 2) {
      setError("Please enter at least two names.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/create-draw/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: namesArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to create draw.");
      }

      const data = await response.json();
      setResult(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the draw.");
    }
  };

  return (
    <div>
      <h1>Create Draw</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter participant names (comma separated):
          <br />
          <textarea
            value={namesInput}
            onChange={(e) => setNamesInput(e.target.value)}
            rows="5"
            cols="50"
            placeholder="e.g. Lucas, German, Pedro"
          />
        </label>
        <br />
        <button type="submit">Create Draw</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h2>Draw Created!</h2>
          <p>Save this code to check assignments:</p>
          <pre>{result.code}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateDrawPage;

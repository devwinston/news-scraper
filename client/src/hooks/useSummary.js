import { useState } from "react";

const useSummary = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const getSummary = async (provider, url) => {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, url }),
    });

    const json = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(json.error);
      return null;
    } else {
      setLoading(false);
      setError(null);
      return json.content;
    }
  };

  return { getSummary, loading, error };
};

export default useSummary;

import { useEffect, useState } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/news");

      const json = await response.json();

      if (response.ok) {
        setData(json);
        setLoading(false);
        setError(null);
      } else {
        setData(null);
        setLoading(false);
        setError(json.error);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetch;

import { useState, useEffect } from "react";

export const useFetch = ({ url, METHOD = "GET", body = null, trigger }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const options = {
          method: METHOD,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };

        if (
          (METHOD === "POST" || METHOD === "PATCH" || METHOD === "PUT") &&
          body
        ) {
          options.body = JSON.stringify(body);
        }

        if (METHOD === "DELETE" && body) {
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = METHOD === "DELETE" ? null : await res.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (trigger) {
      fetchData();
    }
  }, [url, METHOD, body, trigger]);

  return { data, loading, error };
};

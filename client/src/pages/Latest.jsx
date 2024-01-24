import React, { useState } from "react";
import { motion } from "framer-motion";

import useFetch from "../hooks/useFetch";
import useSummary from "../hooks/useSummary";

const Latest = () => {
  const { data, loading, error } = useFetch();
  const {
    getSummary,
    loading: loadingSummary,
    error: errorSummary,
  } = useSummary();
  const [summary, setSummary] = useState(null);

  const handleClick = async (url) => {
    setSummary(null);
    const content = await getSummary(url);
    setSummary(content);
  };

  return (
    <div className="latest">
      <div className="articles">
        <h1>Latest News</h1>
        {loading && <p>Loading...</p>}
        {data &&
          data.map((article, index) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0, 0.7, 0.2, 1],
              }}
            >
              <img
                src="https://onecms-res.cloudinary.com/image/upload/v1628577495/mediacorp/cna/image/2021-08/cna-logo-data.jpg"
                alt="cna_logo"
              />
              <div className="card-content">
                <a
                  href={article.proxy + article.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {article.title}
                </a>
                <p>{article.time}</p>
                <button
                  onClick={() => handleClick(article.proxy + article.link)}
                >
                  Generate Summary
                </button>
              </div>
            </motion.div>
          ))}
        {error && <p>{error}</p>}
      </div>
      <div className="summary">
        <h1>Summary</h1>
        {summary &&
          summary.map((point, index) => (
            <p key={index}>
              {point}.
              <br />
              <br />
            </p>
          ))}
        {loadingSummary && (
          <p>
            Loading summary...
            <br />
            <br />
          </p>
        )}
        {errorSummary && (
          <p className="error">
            {errorSummary}
            <br />
            <br />
          </p>
        )}
        <p>
          <strong>Powered by OpenAI</strong>
        </p>
      </div>
    </div>
  );
};

export default Latest;

import React from "react";

import Card from "../components/Card";

const Articles = ({
  data,
  loading,
  error,
  category,
  setTitle,
  getSummary,
  setSummary,
  setModal,
}) => {
  return (
    <div className="articles">
      <h1 className="title">Latest {category} News</h1>

      <div className="grid-container">
        {data &&
          data
            .filter((article) => article.category.toLowerCase() === category.toLowerCase())
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(0, 18)
            .map((article, index) => (
              <Card
                key={index}
                provider={article.provider}
                title={article.title}
                url={article.url}
                timestamp={article.timestamp}
                setTitle={setTitle}
                getSummary={getSummary}
                setSummary={setSummary}
                setModal={setModal}
              />
            ))}
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Articles;

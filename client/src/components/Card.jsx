import React from "react";

import cnaLogo from "../assets/images/cna-logo.jpg";
import stLogo from "../assets/images/st-logo.png";

const Card = ({ article, setTitle, getSummary, setSummary, setModal }) => {
  const { provider, title, url, imageUrl, timestamp } = article;
  const handleClick = async (provider, url, title) => {
    setModal(true);
    setTitle(title);
    setSummary(null);
    const content = await getSummary(provider, url);
    setSummary(content);
  };

  return (
    <div className="card">
      <div
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <a className="card-title" href={url} target="_blank" rel="noreferrer">
        {title}
      </a>
      <div className="card-group">
        {provider.toLowerCase() === "cna" && (
          <img src={cnaLogo} alt="news-logo" className="news-logo" />
        )}
        {provider.toLowerCase() === "st" && (
          <img src={stLogo} alt="news-logo" className="news-logo" />
        )}

        {timestamp < 60 && (
          <p className="card-timestamp">{Math.round(timestamp)} seconds ago</p>
        )}
        {timestamp >= 60 && timestamp < 3600 && (
          <p className="card-timestamp">
            {Math.round(timestamp / 60)} minutes ago
          </p>
        )}
        {timestamp >= 3600 && (
          <p className="card-timestamp">
            {Math.round(timestamp / 60 / 60)} hours ago
          </p>
        )}
      </div>
      <button
        className="card-button"
        onClick={() => handleClick(provider, url, title)}
      >
        Generate Summary
      </button>
    </div>
  );
};

export default Card;

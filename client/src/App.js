import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Nav from "./components/Nav";
import Articles from "./pages/Articles";

import Close from "./assets/images/close.png";

import useSummary from "./hooks/useSummary";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [menu, setMenu] = useState(false);

  const [title, setTitle] = useState(null);
  const {
    getSummary,
    loading: loadingSummary,
    error: errorSummary,
  } = useSummary();
  const [summary, setSummary] = useState(null);
  const [modal, setModal] = useState(false);

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

  const categories = ["Singapore", "Asia", "World", "Business", "Sport"];

  return (
    <div className="app">
      <div
        className="overlay"
        style={{ display: menu ? "block" : "none" }}
      ></div>

      <div className="modal" style={{ display: modal ? "block" : "none" }}>
        <img
          src={Close}
          alt="close"
          onClick={() => {
            setModal(false);
          }}
        />
        <h1>Summary</h1>
        <p>
          <strong>
            <u>{title}</u>
          </strong>
        </p>
        {summary &&
          summary.map((point, index) => (
            <p key={index}>
              {point}
              {point[point.length - 1] !== "." && "."}
            </p>
          ))}
        {loadingSummary && <p>Loading summary...</p>}
        {errorSummary && (
          <p className="error">
            {error}
            <br />
            <br />
          </p>
        )}
        <p>
          <strong>Powered by OpenAI</strong>
        </p>
      </div>

      <Router>
        <Nav menu={menu} setMenu={setMenu} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/singapore" />} />
            {categories.map((category, index) => (
              <Route
                key={index}
                path={`/${category.toLowerCase()}`}
                element={
                  <Articles
                    data={data}
                    loading={loading}
                    error={error}
                    category={category}
                    setTitle={setTitle}
                    getSummary={getSummary}
                    setSummary={setSummary}
                    setModal={setModal}
                  />
                }
              />
            ))}
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;

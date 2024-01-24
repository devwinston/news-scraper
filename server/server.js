import path from "path";
import express from "express";

import newsRoutes from "./routes/newsRoutes.js";

// express
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// routes
app.use("/api/news", newsRoutes);

// listen
const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

// deploy
const deploy = true;
if (deploy) {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

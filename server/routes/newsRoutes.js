import express from "express";

import { getArticles, getSummary } from "../controllers/newsControllers.js";

const router = express.Router();

router.route("/").get(getArticles).post(getSummary);

export default router;

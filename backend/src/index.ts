import express from "express";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { TMDB_BASE_URL, TMDB_API_KEY } from "@/config/tmdb";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "ShowDeck backend is running" });
});

app.get("/shows/popular", async (_req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: 1,
      },
    });

    res.json({
      results: response.data.results.map((show: any) => ({ ...show })),
    });
  } catch (error: any) {
    console.error("Failed to fetch popular TV shows:", error.message);
    res.status(500).json({ error: "Failed to fetch popular TV shows" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

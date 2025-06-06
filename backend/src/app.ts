import express from "express";
import cors from "cors";
import axios from "axios";
import { TMDB_BASE_URL, TMDB_API_KEY } from "@/config/tmdb";
import authRoutes from "@/routes/auth";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "ShowDeck backend is running" });
});

// Register/login/logout routes
app.use("/auth", authRoutes);

// Popular TV shows
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

// Single TV show details
app.get("/shows/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });

    res.json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).json({ error: "Show not found" });
    } else {
      console.error("Failed to fetch TV show details:", error.message);
      res.status(500).json({ error: "Failed to fetch TV show details" });
    }
  }
});

export default app;

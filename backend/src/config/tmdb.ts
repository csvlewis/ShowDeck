export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("❌ TMDB_API_KEY is missing from environment variables.");
}

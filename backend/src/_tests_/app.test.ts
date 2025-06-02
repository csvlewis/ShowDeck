process.env.TMDB_API_KEY = "test_api_key";

import request from "supertest";
import nock from "nock";
import app from "../app";
import { TMDB_BASE_URL } from "@/config/tmdb";

describe("Backend API routes", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test("GET /health returns status OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "OK",
      message: "ShowDeck backend is running",
    });
  });

  test("GET /shows/popular returns mocked TV shows", async () => {
    const mockResponse = {
      results: [
        { id: 1, name: "Mock Show 1", overview: "Overview 1" },
        { id: 2, name: "Mock Show 2", overview: "Overview 2" },
      ],
    };

    nock(TMDB_BASE_URL).get("/tv/popular").query(true).reply(200, mockResponse);

    const res = await request(app).get("/shows/popular");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ results: mockResponse.results });
  });

  test("GET /shows/popular handles TMDB API errors gracefully", async () => {
    nock(TMDB_BASE_URL)
      .get("/tv/popular")
      .query(true)
      .replyWithError("TMDB API failure");

    const res = await request(app).get("/shows/popular");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch popular TV shows" });
  });
});

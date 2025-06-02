process.env.TMDB_API_KEY = "test_api_key";

import request from "supertest";
import nock from "nock";
import app from "../app";
import { TMDB_BASE_URL } from "@/config/tmdb";

describe("Backend API routes", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe("GET /health", () => {
    test("returns status OK", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "OK",
        message: "ShowDeck backend is running",
      });
    });
  });

  describe("GET /shows/popular", () => {
    test("returns popular TV shows", async () => {
      const mockResponse = {
        results: [
          { id: 1, name: "Mock Show 1", overview: "Overview 1" },
          { id: 2, name: "Mock Show 2", overview: "Overview 2" },
        ],
      };

      nock(TMDB_BASE_URL)
        .get("/tv/popular")
        .query(true)
        .reply(200, mockResponse);

      const res = await request(app).get("/shows/popular");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ results: mockResponse.results });
    });

    test("returns 500 on failure", async () => {
      nock(TMDB_BASE_URL)
        .get("/tv/popular")
        .query(true)
        .replyWithError("TMDB API failure");

      const res = await request(app).get("/shows/popular");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch popular TV shows" });
    });
  });

  describe("GET /show/:id", () => {
    const showId = 123;

    test("returns TV show details for a valid id", async () => {
      const mockShowDetail = {
        id: showId,
        name: "Mock Show Detail",
        overview: "Detailed overview",
        poster_path: "/mockpath.jpg",
      };

      nock(TMDB_BASE_URL)
        .get(`/tv/${showId}`)
        .query(true)
        .reply(200, mockShowDetail);

      const res = await request(app).get(`/show/${showId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockShowDetail);
    });

    test("returns 404 for non-existent show", async () => {
      nock(TMDB_BASE_URL).get(`/tv/${showId}`).query(true).reply(404, {
        status_message: "The resource you requested could not be found.",
      });

      const res = await request(app).get(`/show/${showId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Show not found" });
    });

    test("returns 500 on failure", async () => {
      nock(TMDB_BASE_URL)
        .get(`/tv/${showId}`)
        .query(true)
        .replyWithError("TMDB API failure");

      const res = await request(app).get(`/show/${showId}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch TV show details" });
    });
  });
});

process.env.TMDB_API_KEY = "test_api_key";

import request from "supertest";
import nock from "nock";
import app from "../app";
import { TMDB_BASE_URL } from "@/config/tmdb";
import { db } from "@/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("@/db", () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    })),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

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

  describe("Auth routes", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("POST /auth/register", () => {
      test("registers a new user", async () => {
        const mockUser = { id: 1, email: "new@example.com" };
        (db.query.users.findFirst as jest.Mock).mockResolvedValue(undefined);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
        (db.insert as jest.Mock).mockReturnValue({
          values: jest.fn().mockReturnThis(),
          returning: jest.fn().mockResolvedValue([mockUser]),
        });
        (jwt.sign as jest.Mock).mockReturnValue("mockToken");

        const res = await request(app)
          .post("/auth/register")
          .send({ email: "new@example.com", password: "password123" });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
          token: "mockToken",
          user: { id: 1, email: "new@example.com" },
        });
      });

      test("fails if email or password missing", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Email and password required" });
      });

      test("fails if user already exists", async () => {
        (db.query.users.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

        const res = await request(app)
          .post("/auth/register")
          .send({ email: "existing@example.com", password: "123" });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: "User already exists" });
      });
    });

    describe("POST /auth/login", () => {
      test("logs in an existing user", async () => {
        const mockUser = {
          id: 2,
          email: "user@example.com",
          password: "hashed",
        };
        (db.query.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("loginToken");

        const res = await request(app)
          .post("/auth/login")
          .send({ email: "user@example.com", password: "password123" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          token: "loginToken",
          user: { id: 2, email: "user@example.com" },
        });
      });

      test("fails with invalid email", async () => {
        (db.query.users.findFirst as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app)
          .post("/auth/login")
          .send({ email: "missing@example.com", password: "pass" });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
      });

      test("fails with incorrect password", async () => {
        (db.query.users.findFirst as jest.Mock).mockResolvedValue({
          id: 3,
          email: "user@example.com",
          password: "hashed",
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const res = await request(app)
          .post("/auth/login")
          .send({ email: "user@example.com", password: "wrongpass" });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Invalid email or password" });
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

  describe("GET shows/:id", () => {
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

      const res = await request(app).get(`/shows/${showId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockShowDetail);
    });

    test("returns 404 for non-existent show", async () => {
      nock(TMDB_BASE_URL).get(`/tv/${showId}`).query(true).reply(404, {
        status_message: "The resource you requested could not be found.",
      });

      const res = await request(app).get(`/shows/${showId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Show not found" });
    });

    test("returns 500 on failure", async () => {
      nock(TMDB_BASE_URL)
        .get(`/tv/${showId}`)
        .query(true)
        .replyWithError("TMDB API failure");

      const res = await request(app).get(`/shows/${showId}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch TV show details" });
    });
  });
});

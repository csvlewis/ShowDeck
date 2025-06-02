import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PopularShows from "../PopularShows";

vi.mock("@/api/shows", () => ({
  fetchPopularShows: vi.fn(),
}));

import { fetchPopularShows } from "@/api/shows";

describe("PopularShows", () => {
  test("renders loading state initially", () => {
    (fetchPopularShows as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );
    render(<PopularShows />);
    expect(screen.getByText(/loading popular shows/i)).toBeInTheDocument();
  });

  test("renders shows when fetchPopularShows resolves", async () => {
    const mockShows = [
      {
        id: 1,
        name: "Mock Show 1",
        overview: "Overview 1",
        poster_path: "/path1.jpg",
      },
      {
        id: 2,
        name: "Mock Show 2",
        overview: "Overview 2",
        poster_path: "/path2.jpg",
      },
    ];
    (fetchPopularShows as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockShows
    );

    render(<PopularShows />);

    await waitFor(() => {
      expect(screen.getByText("Popular TV Shows")).toBeInTheDocument();
    });

    expect(screen.getByText("Mock Show 1")).toBeInTheDocument();
    expect(screen.getByText("Overview 1")).toBeInTheDocument();
    expect(screen.getByText("Mock Show 2")).toBeInTheDocument();
    expect(screen.getByText("Overview 2")).toBeInTheDocument();
  });

  test("renders error message if fetchPopularShows rejects", async () => {
    (fetchPopularShows as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<PopularShows />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
});

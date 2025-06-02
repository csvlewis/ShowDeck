import { describe, test, expect, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/pages/HomePage";

vi.mock("@/api/shows", () => ({
  fetchPopularShows: vi.fn(),
}));

import { fetchPopularShows } from "@/api/shows";

describe("HomePage", () => {
  test("renders heading, shows loading, then renders popular shows", async () => {
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

    (fetchPopularShows as Mock).mockResolvedValue(mockShows);

    render(<HomePage />);

    expect(screen.getByText(/loading popular shows/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Popular TV Shows")).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "ShowDeck"
    );

    for (const show of mockShows) {
      expect(screen.getByText(show.name)).toBeInTheDocument();
      expect(screen.getByText(show.overview)).toBeInTheDocument();
    }
  });
});

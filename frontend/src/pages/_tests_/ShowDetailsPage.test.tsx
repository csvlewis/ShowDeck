import { describe, test, expect, vi, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ShowDetailsPage from "../ShowDetailsPage";

vi.mock("@/api/shows", () => ({
  fetchShowById: vi.fn(),
}));

import { fetchShowById } from "@/api/shows";
import type { ShowDetails } from "@/api/shows";

describe("ShowDetailsPage", () => {
  const mockId = 123;

  function renderWithRouter() {
    render(
      <MemoryRouter initialEntries={[`/shows/${mockId}`]}>
        <Routes>
          <Route path="/shows/:id" element={<ShowDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("shows loading state initially", () => {
    (fetchShowById as Mock).mockReturnValue(new Promise(() => {}));

    renderWithRouter();

    expect(screen.getByText(/loading show details/i)).toBeInTheDocument();
  });

  test("renders show details when fetchShowById resolves", async () => {
    const mockShow: ShowDetails = {
      id: mockId,
      name: "Mock Show Detail",
      overview: "A detailed overview of the show.",
      poster_path: "/mockposter.jpg",
      first_air_date: "2023-10-01",
      vote_average: 8.5,
    };

    (fetchShowById as Mock).mockResolvedValue(mockShow);

    renderWithRouter();

    expect(screen.getByText(/loading show details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        mockShow.name
      );
    });

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300${mockShow.poster_path}`
    );
    expect(screen.getByText(mockShow.overview)).toBeInTheDocument();
    expect(
      screen.getByText(`First Air Date: ${mockShow.first_air_date}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Rating: ${mockShow.vote_average}`)
    ).toBeInTheDocument();
  });

  test("renders error message if fetchShowById rejects", async () => {
    (fetchShowById as Mock).mockRejectedValue(new Error("Fetch failed"));

    renderWithRouter();

    expect(screen.getByText(/loading show details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/error: fetch failed/i)).toBeInTheDocument();
    });
  });

  test("renders 'Show not found.' if fetchShowById resolves to null", async () => {
    (fetchShowById as Mock).mockResolvedValue(null);

    renderWithRouter();

    expect(screen.getByText(/loading show details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/show not found\./i)).toBeInTheDocument();
    });
  });
});

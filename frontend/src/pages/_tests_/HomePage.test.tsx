import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import HomePage from "@/pages/HomePage";
import authReducer from "@/store/authSlice";

vi.mock("@/api/shows", () => ({
  fetchPopularShows: vi.fn(),
}));
import { fetchPopularShows } from "@/api/shows";

describe("HomePage", () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
    });

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

    (fetchPopularShows as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockShows
    );

    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/loading popular shows/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Popular TV Shows")).toBeInTheDocument();
    });

    const heading = screen.getAllByRole("heading", { level: 2 })[0];
    expect(heading).toHaveTextContent("ShowDeck");

    for (const show of mockShows) {
      expect(screen.getByText(show.name)).toBeInTheDocument();
      expect(screen.getByText(show.overview)).toBeInTheDocument();
    }
  });
});

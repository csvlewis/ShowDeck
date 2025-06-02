import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MediaCard from "../MediaCard";

describe("MediaCard", () => {
  test("renders card for movie or TV show with title, description and image", () => {
    render(
      <MemoryRouter>
        <MediaCard
          id={1}
          title="Test Show"
          description="A description"
          imagePath="/test.jpg"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Show")).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w200/test.jpg"
    );
    expect(img).toHaveAttribute("alt", "Test Show poster");
  });
});

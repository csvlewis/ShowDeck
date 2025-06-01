export interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export async function fetchPopularShows(): Promise<Show[]> {
  const response = await fetch("http://localhost:4000/shows/popular");
  if (!response.ok) {
    throw new Error("Failed to fetch popular shows");
  }
  const data = await response.json();
  return data.results;
}

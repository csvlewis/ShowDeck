export interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export interface ShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  first_air_date?: string;
  vote_average?: number;
}

export async function fetchPopularShows(): Promise<Show[]> {
  const response = await fetch("http://localhost:4000/shows/popular");
  if (!response.ok) {
    throw new Error("Failed to fetch popular shows");
  }
  const data = await response.json();
  return data.results;
}

export async function fetchShowById(id: number): Promise<ShowDetails> {
  const response = await fetch(`http://localhost:4000/shows/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch show details");
  }
  return response.json();
}

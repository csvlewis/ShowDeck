import { useEffect, useState } from "react";
import { fetchPopularShows, type Show } from "@/api/shows";
import MediaCard from "./MediaCard";

export default function PopularShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularShows()
      .then(setShows)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading popular shows...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Popular TV Shows</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {shows.map((show) => (
          <MediaCard
            key={show.id}
            id={show.id}
            title={show.name}
            description={show.overview}
            imagePath={show.poster_path}
          />
        ))}
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchShowById, type ShowDetails } from "@/api/shows";

export default function ShowDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetchShowById(Number(id))
      .then(setShow)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading show details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!show) return <p>Show not found.</p>;

  return (
    <div>
      <h1>{show.name}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
        alt={`${show.name} poster`}
        style={{ maxWidth: "100%", borderRadius: 4 }}
      />
      <p>{show.overview}</p>
      {show.first_air_date && <p>First Air Date: {show.first_air_date}</p>}
      {show.vote_average && <p>Rating: {show.vote_average}</p>}
    </div>
  );
}

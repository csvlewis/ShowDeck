import { Link } from "react-router-dom";

export interface MediaCardProps {
  id: number;
  title: string;
  description: string;
  imagePath?: string;
  imageBaseUrl?: string;
}

export default function MediaCard({
  id,
  title,
  description,
  imagePath,
  imageBaseUrl = "https://image.tmdb.org/t/p/w200",
}: MediaCardProps) {
  return (
    <div
      key={id}
      className="media-card"
      style={{
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        maxWidth: 300,
      }}
    >
      <h3>{title}</h3>
      {imagePath && (
        <Link to={`/show/${id}`}>
          <img
            src={`${imageBaseUrl}${imagePath}`}
            alt={`${title} poster`}
            style={{ maxWidth: "100%", borderRadius: 4 }}
          />
        </Link>
      )}
      <p>{description}</p>
    </div>
  );
}

import PopularShows from "@/components/PopularShows";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  return (
    <div className="App">
      <NavBar />
      <PopularShows />
    </div>
  );
}

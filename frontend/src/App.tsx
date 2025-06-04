import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ShowDetailsPage from "@/pages/ShowDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="shows/:id" element={<ShowDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

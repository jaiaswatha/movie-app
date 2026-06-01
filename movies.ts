import { Router } from "express";
import type { Movie, ListMovies200, GetMovie200, ErrorResponse } from "@workspace/api-zod";
import moviesRaw from "../data/movies_metadata.json" with { type: "json" };

const router = Router();

const moviesData: Movie[] = moviesRaw as Movie[];

router.get("/movies", (req, res) => {
  const response: ListMovies200 = { data: moviesData };
  res.json(response);
});

router.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const movie = moviesData.find((m) => m.id === id);
  if (!movie) {
    const notFound: ErrorResponse = { error: "Movie not found" };
    res.status(404).json(notFound);
    return;
  }
  const response: GetMovie200 = { data: movie };
  res.json(response);
});

export default router;

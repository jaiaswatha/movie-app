import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useListMovies, getListMoviesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Film, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RATING_FILTERS = [
  { label: "All", min: 0 },
  { label: "6+", min: 6 },
  { label: "7+", min: 7 },
  { label: "8+", min: 8 },
];

export default function Home() {
  const { data: moviesResponse, isLoading, isError } = useListMovies({
    query: {
      queryKey: getListMoviesQueryKey()
    }
  });
  const movies = moviesResponse?.data;

  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    if (!movies) return [];
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q);
      const matchesRating = m.vote_average >= minRating;
      return matchesSearch && matchesRating;
    });
  }, [movies, search, minRating]);

  const hasFilters = search.trim() !== "" || minRating > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center gap-2">
          <Film className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Cinematheque</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 max-w-2xl animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Curated Classics
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore a meticulously selected library of foundational cinema.
            From golden age masterpieces to definitive modern classics.
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-3 animate-fade-in-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by title or tagline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 bg-card border-border focus-visible:ring-primary/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {RATING_FILTERS.map((f) => (
              <Button
                key={f.label}
                variant={minRating === f.min ? "default" : "outline"}
                size="sm"
                onClick={() => setMinRating(f.min)}
                className={
                  minRating === f.min
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }
              >
                {f.min > 0 && <Star className="w-3 h-3 mr-1" />}
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full rounded-xl bg-card border border-border" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-12 text-center border border-destructive/20 bg-destructive/10 rounded-xl">
            <p className="text-destructive font-medium">Failed to load the archive.</p>
          </div>
        )}

        {movies && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {hasFilters ? (
                  <>
                    <span className="text-foreground font-medium">{filtered.length}</span>
                    {" "}of {movies.length} films
                  </>
                ) : (
                  <><span className="text-foreground font-medium">{movies.length}</span> films</>
                )}
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setMinRating(0); }}
                  className="text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="py-24 text-center border border-border rounded-xl bg-card/30">
                <p className="text-muted-foreground font-medium">No films match your search.</p>
                <button
                  onClick={() => { setSearch(""); setMinRating(0); }}
                  className="mt-3 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((movie, index) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`}>
                    <Card className="group h-full cursor-pointer overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: `${(index % 8) * 0.1}s` }}>
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-12">
                          <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {movie.title}
                          </h3>
                          {movie.tagline && (
                            <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                              {movie.tagline}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

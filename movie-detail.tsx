import { useRoute, Link } from "wouter";
import { useGetMovie, getGetMovieQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Star, Clock, Calendar, Info, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function MovieDetail() {
  const [, params] = useRoute("/movies/:id");
  const movieId = params?.id ? parseInt(params.id, 10) : 0;

  const { data: movieResponse, isLoading, isError } = useGetMovie(movieId, {
    query: {
      enabled: !!movieId,
      queryKey: getGetMovieQueryKey(movieId)
    }
  });
  const movie = movieResponse?.data;

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "Unknown";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-secondary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">Cinematheque</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 max-w-md bg-card border border-border rounded-lg" />
            <Skeleton className="h-6 w-1/2 bg-card border border-border rounded-md" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24 bg-card border border-border rounded-full" />
              <Skeleton className="h-10 w-32 bg-card border border-border rounded-full" />
            </div>
            <Skeleton className="h-48 w-full bg-card border border-border rounded-xl mt-8" />
          </div>
        )}

        {isError && (
          <div className="p-12 text-center border border-destructive/20 bg-destructive/10 rounded-xl">
            <p className="text-destructive font-medium">Failed to retrieve film details.</p>
            <Link href="/" className="mt-4 inline-block text-primary hover:underline">
              Return to archive
            </Link>
          </div>
        )}

        {movie && (
          <div className="animate-fade-in-up">
            <div className="mb-8 space-y-4">
              {movie.tagline && (
                <div className="text-primary font-medium tracking-wide uppercase text-sm">
                  {movie.tagline}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {movie.title}
              </h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-xl text-muted-foreground italic">
                  {movie.original_title}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full border border-border bg-card font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">({movie.vote_count} votes)</span>
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full border border-border bg-card font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {formatRuntime(movie.runtime)}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full border border-border bg-card font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(movie.release_date)}
              </Badge>
              {movie.status && (
                <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full border border-border bg-card font-medium flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  {movie.status}
                </Badge>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 relative z-10">
                Synopsis
              </h2>
              <Separator className="mb-6 bg-border" />
              <p className="text-lg leading-relaxed text-muted-foreground relative z-10">
                {movie.overview || "No synopsis available."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

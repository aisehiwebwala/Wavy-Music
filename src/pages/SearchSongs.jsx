import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchSongs } from "../api/client";
import SongRow from "../components/SongRow";
import { SkeletonList } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { Music, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchSongs() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const page = Number(params.get("page")) || 1;
  const [input, setInput] = useState(query);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    searchSongs(query, page, 20)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setParams({ q: input.trim() });
    }
  };

  const goToPage = (p) => {
    setParams({ q: query, page: String(p) });
    window.scrollTo(0, 0);
  };

  const songs = data?.results || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-8">
      <h1 className="text-3xl font-bold text-white mb-1">Search Songs</h1>
      <p className="text-text-secondary text-sm mb-6">Find songs by title, artist, or lyrics</p>

      <form onSubmit={handleSubmit} className="max-w-xl mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for songs..."
            className="w-full bg-surface-lighter rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-text-muted outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
          />
        </div>
      </form>

      {!query && (
        <div className="flex flex-col items-center py-16">
          <Music size={48} className="text-text-muted mb-4" />
          <p className="text-text-secondary">Type a song name to start searching</p>
        </div>
      )}

      {error && <ErrorState message={error} onRetry={() => setParams({ q: query, page: String(page) })} />}

      {loading && <SkeletonList count={10} />}

      {!loading && query && songs.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-text-secondary">
              {total.toLocaleString()} results
            </p>
          </div>

          <div className="bg-surface-light/20 rounded-xl overflow-hidden">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} index={(page - 1) * 20 + i} songs={songs} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary hover:text-white hover:bg-surface-lighter transition-colors"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  } else {
                    p = page - 3 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-brand text-white"
                          : "text-text-secondary hover:text-white hover:bg-surface-lighter"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary hover:text-white hover:bg-surface-lighter transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && query && songs.length === 0 && !error && (
        <div className="flex flex-col items-center py-16">
          <Music size={48} className="text-text-muted mb-4" />
          <p className="text-text-secondary">No songs found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

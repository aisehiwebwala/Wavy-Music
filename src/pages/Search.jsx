import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { globalSearch, searchSongs } from "../api/client";
import { getArtistNames } from "../api/helpers";
import MediaCard from "../components/MediaCard";
import SongRow from "../components/SongRow";
import Section from "../components/Section";
import { SkeletonGrid, SkeletonList } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { Music, Disc3, Mic2, ListMusic } from "lucide-react";

const TABS = [
  { key: "all", label: "All", icon: null },
  { key: "songs", label: "Songs", icon: Music },
  { key: "albums", label: "Albums", icon: Disc3 },
  { key: "artists", label: "Artists", icon: Mic2 },
  { key: "playlists", label: "Playlists", icon: ListMusic },
];

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [tab, setTab] = useState("all");
  const [data, setData] = useState(null);
  const [songsData, setSongsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = () => {
    if (!query) {
      setData(null);
      setSongsData(null);
      return;
    }
    setLoading(true);
    setError(null);

    const fetches = [globalSearch(query)];
    if (tab === "songs" || tab === "all") {
      fetches.push(searchSongs(query, 1, 30));
    }

    Promise.all(fetches)
      .then(([searchData, songsResult]) => {
        setData(searchData);
        if (songsResult) setSongsData(songsResult);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
  }, [query, tab]);

  if (!query) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
        <p className="text-text-secondary">Find your favorite songs, artists, albums, and playlists</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {["Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Jazz", "Classical", "Bollywood"].map((genre) => (
            <a
              key={genre}
              href={`/search?q=${encodeURIComponent(genre)}`}
              className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-brand to-purple-900 p-4 hover:scale-[1.02] transition-transform"
            >
              <span className="text-lg font-bold text-white">{genre}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={fetchResults} />;

  const songs = songsData?.results || [];
  const albums = data?.albums?.results || [];
  const artists = data?.artists?.results || [];
  const playlists = data?.playlists?.results || [];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-1">
        Results for &ldquo;{query}&rdquo;
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mt-4 mb-6 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key
                ? "bg-white text-black"
                : "bg-surface-lighter text-text-secondary hover:text-white hover:bg-surface-hover"
            }`}
          >
            {t.icon && <t.icon size={14} />}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <>
          <SkeletonList count={5} />
          <div className="mt-6"><SkeletonGrid /></div>
        </>
      ) : (
        <>
          {(tab === "all" || tab === "songs") && songs.length > 0 && (
            <Section title="Songs">
              <div className="bg-surface-light/30 rounded-xl overflow-hidden">
                {songs.slice(0, tab === "songs" ? 30 : 8).map((song, i) => (
                  <SongRow key={song.id} song={song} index={i} songs={songs} />
                ))}
              </div>
            </Section>
          )}

          {(tab === "all" || tab === "albums") && albums.length > 0 && (
            <Section title="Albums">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {albums.slice(0, tab === "albums" ? 18 : 6).map((album) => (
                  <MediaCard
                    key={album.id}
                    item={album}
                    type="album"
                    subtitle={album.artist || album.description}
                  />
                ))}
              </div>
            </Section>
          )}

          {(tab === "all" || tab === "artists") && artists.length > 0 && (
            <Section title="Artists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {artists.slice(0, tab === "artists" ? 18 : 6).map((artist) => (
                  <MediaCard
                    key={artist.id}
                    item={artist}
                    type="artist"
                    subtitle={artist.description}
                  />
                ))}
              </div>
            </Section>
          )}

          {(tab === "all" || tab === "playlists") && playlists.length > 0 && (
            <Section title="Playlists">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                {playlists.slice(0, tab === "playlists" ? 18 : 6).map((pl) => (
                  <MediaCard
                    key={pl.id}
                    item={pl}
                    type="playlist"
                    subtitle={pl.description || pl.language}
                  />
                ))}
              </div>
            </Section>
          )}

          {!songs.length && !albums.length && !artists.length && !playlists.length && (
            <div className="flex flex-col items-center py-20">
              <Music size={48} className="text-text-muted mb-4" />
              <p className="text-text-secondary">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

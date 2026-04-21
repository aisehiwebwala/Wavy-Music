import { useState, useEffect } from "react";
import { globalSearch } from "../api/client";
import { getArtistNames } from "../api/helpers";
import MediaCard from "../components/MediaCard";
import Section from "../components/Section";
import { SkeletonGrid } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";

const FEATURED_QUERIES = ["trending", "bollywood", "pop hits", "chill vibes", "romantic"];

export default function Home() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHome = async () => {
    setLoading(true);
    setError(null);
    try {
      const queries = FEATURED_QUERIES.slice(0, 3);
      const results = await Promise.all(queries.map((q) => globalSearch(q)));
      const built = [];
      results.forEach((data, i) => {
        if (data.songs?.results?.length) {
          built.push({
            title: queries[i].charAt(0).toUpperCase() + queries[i].slice(1) + " Songs",
            type: "song",
            items: data.songs.results,
          });
        }
        if (data.albums?.results?.length) {
          built.push({
            title: queries[i].charAt(0).toUpperCase() + queries[i].slice(1) + " Albums",
            type: "album",
            items: data.albums.results,
          });
        }
        if (data.artists?.results?.length) {
          built.push({
            title: queries[i].charAt(0).toUpperCase() + queries[i].slice(1) + " Artists",
            type: "artist",
            items: data.artists.results,
          });
        }
        if (data.playlists?.results?.length) {
          built.push({
            title: queries[i].charAt(0).toUpperCase() + queries[i].slice(1) + " Playlists",
            type: "playlist",
            items: data.playlists.results,
          });
        }
      });
      setSections(built);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  if (error) return <ErrorState message={error} onRetry={fetchHome} />;

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
        </h1>
        <p className="text-text-secondary mt-1">Discover something new today</p>
      </div>

      {loading ? (
        <>
          <div className="mb-8">
            <div className="h-7 bg-surface-lighter rounded w-48 mb-4 animate-pulse" />
            <SkeletonGrid />
          </div>
          <div className="mb-8">
            <div className="h-7 bg-surface-lighter rounded w-48 mb-4 animate-pulse" />
            <SkeletonGrid />
          </div>
        </>
      ) : (
        sections.map((section) => (
          <Section key={section.title} title={section.title}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {section.items.slice(0, 6).map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  type={section.type}
                  subtitle={
                    section.type === "song"
                      ? item.primaryArtists || item.singers || getArtistNames(item.artists)
                      : section.type === "album"
                      ? item.artist || item.description
                      : section.type === "artist"
                      ? item.description
                      : item.description || item.language
                  }
                />
              ))}
            </div>
          </Section>
        ))
      )}
    </div>
  );
}

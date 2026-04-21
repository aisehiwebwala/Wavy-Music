import { useParams } from "react-router-dom";
import { getSongById, getSongSuggestions } from "../api/client";
import { useApi } from "../hooks/useApi";
import { getImageUrl, getArtistNames, formatDuration } from "../api/helpers";
import SongRow from "../components/SongRow";
import MediaCard from "../components/MediaCard";
import Section from "../components/Section";
import { SkeletonList } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { usePlayer } from "../contexts/PlayerContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { Play, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SongDetail() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useApi(() => getSongById(id), [id]);
  const [suggestions, setSuggestions] = useState([]);
  const { playTrack, playQueue } = usePlayer();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (id) {
      getSongSuggestions(id).then(setSuggestions).catch(() => setSuggestions([]));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 animate-pulse">
          <div className="w-48 h-48 md:w-56 md:h-56 bg-surface-lighter rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-surface-lighter rounded w-16 mb-2" />
            <div className="h-8 bg-surface-lighter rounded w-64 mb-3" />
            <div className="h-4 bg-surface-lighter rounded w-48 mb-6" />
          </div>
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const song = data?.[0];
  if (!song) return null;

  const image = getImageUrl(song.image, "500x500");
  const artistNames = getArtistNames(song.artists);
  const liked = isFavorite(song.id);

  const handlePlay = () => {
    if (suggestions.length > 0) {
      playQueue([song, ...suggestions], 0);
    } else {
      playTrack(song);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-2xl shrink-0 bg-surface-lighter">
          {image && <img src={image} alt={song.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col justify-end">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Song</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 mb-2">{song.name}</h1>
          <div className="flex flex-wrap items-center gap-1 text-sm text-text-secondary">
            {song.artists?.primary?.[0] && (
              <Link to={`/artist/${song.artists.primary[0].id}`} className="font-semibold text-white hover:underline">
                {artistNames}
              </Link>
            )}
            {song.album?.name && song.album?.id && (
              <>
                <span>&middot;</span>
                <Link to={`/album/${song.album.id}`} className="hover:underline">{song.album.name}</Link>
              </>
            )}
            {song.year && <span>&middot; {song.year}</span>}
            {song.duration && <span>&middot; {formatDuration(song.duration)}</span>}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand rounded-full text-white font-semibold text-sm hover:bg-brand-light transition-colors"
            >
              <Play size={18} fill="currentColor" /> Play
            </button>
            <button onClick={() => toggleFavorite(song)}>
              <Heart
                size={28}
                className={liked ? "fill-brand text-brand" : "text-text-muted hover:text-white transition-colors"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Section title="Similar Songs">
          <div className="bg-surface-light/20 rounded-xl overflow-hidden">
            {suggestions.slice(0, 10).map((s, i) => (
              <SongRow key={s.id} song={s} index={i} songs={suggestions} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

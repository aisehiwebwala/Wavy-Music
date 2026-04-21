import { useParams } from "react-router-dom";
import { getPlaylist } from "../api/client";
import { useApi } from "../hooks/useApi";
import { getImageUrl, formatDuration, formatCount } from "../api/helpers";
import SongRow from "../components/SongRow";
import { SkeletonList } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { usePlayer } from "../contexts/PlayerContext";
import { Play, Clock, Shuffle } from "lucide-react";

export default function Playlist() {
  const { id } = useParams();
  const { data: playlist, loading, error, refetch } = useApi(() => getPlaylist(id), [id]);
  const { playQueue } = usePlayer();

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 animate-pulse">
          <div className="w-48 h-48 md:w-56 md:h-56 bg-surface-lighter rounded-xl shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-surface-lighter rounded w-16 mb-2" />
            <div className="h-8 bg-surface-lighter rounded w-64 mb-3" />
            <div className="h-4 bg-surface-lighter rounded w-48 mb-6" />
            <div className="h-10 bg-surface-lighter rounded-full w-32" />
          </div>
        </div>
        <SkeletonList count={10} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!playlist) return null;

  const image = getImageUrl(playlist.image, "500x500");
  const songs = playlist.songs || [];
  const totalDuration = songs.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

  const handlePlayAll = () => {
    const playable = songs.filter((s) => s.downloadUrl?.length);
    if (playable.length) playQueue(playable, 0);
  };

  const handleShuffle = () => {
    const playable = songs.filter((s) => s.downloadUrl?.length);
    if (playable.length) {
      const shuffled = [...playable].sort(() => Math.random() - 0.5);
      playQueue(shuffled, 0);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-2xl shrink-0 bg-surface-lighter">
          {image && <img src={image} alt={playlist.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col justify-end">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Playlist</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 mb-2">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-text-secondary mb-2">{playlist.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-1 text-sm text-text-secondary">
            {playlist.songCount && <span>{playlist.songCount} songs</span>}
            {totalDuration > 0 && <span> &middot; {formatDuration(totalDuration)}</span>}
            {playlist.playCount && <span> &middot; {formatCount(playlist.playCount)} plays</span>}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand rounded-full text-white font-semibold text-sm hover:bg-brand-light transition-colors"
            >
              <Play size={18} fill="currentColor" /> Play
            </button>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface-lighter rounded-full text-white font-medium text-sm hover:bg-surface-hover transition-colors"
            >
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Track list header */}
      <div className="flex items-center gap-3 px-4 py-2 text-xs text-text-muted uppercase tracking-wider border-b border-white/5 mb-1">
        <span className="w-6 text-center">#</span>
        <span className="w-10" />
        <span className="flex-1">Title</span>
        <span className="hidden md:block flex-1 max-w-[200px]">Album</span>
        <span className="w-24 text-right flex items-center justify-end gap-1">
          <Clock size={12} />
        </span>
      </div>

      {/* Songs */}
      <div className="bg-surface-light/20 rounded-xl overflow-hidden">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songs={songs} />
        ))}
      </div>
    </div>
  );
}

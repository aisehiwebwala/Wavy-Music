import { Play, Pause, Heart, MoreHorizontal, Plus } from "lucide-react";
import { getImageUrl, getArtistNames, formatDuration } from "../api/helpers";
import { usePlayer } from "../contexts/PlayerContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SongRow({ song, index, songs }) {
  const { playQueue, currentSong, isPlaying, togglePlay, addToQueue } = usePlayer();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showMenu, setShowMenu] = useState(false);

  const image = getImageUrl(song.image, "150x150");
  const artists = getArtistNames(song.artists);
  const isActive = currentSong?.id === song.id;
  const liked = isFavorite(song.id);

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playQueue(songs || [song], songs ? index : 0);
    }
  };

  return (
    <div
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handlePlay()}
      className={`group flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-surface-lighter/60 transition-colors cursor-pointer active:bg-surface-lighter/80 ${
        isActive ? "bg-surface-lighter/40" : ""
      }`}
    >
      {/* Track number / play button */}
      <div className="w-6 text-center shrink-0">
        <span className={`text-sm hidden sm:inline sm:group-hover:hidden ${isActive ? "text-brand" : "text-text-muted"}`}>
          {isActive && isPlaying ? (
            <span className="flex items-center justify-center gap-px">
              <span className="w-0.5 h-3 bg-brand animate-pulse rounded-full" />
              <span className="w-0.5 h-2 bg-brand animate-pulse rounded-full delay-75" />
              <span className="w-0.5 h-3.5 bg-brand animate-pulse rounded-full delay-150" />
            </span>
          ) : (
            index + 1
          )}
        </span>
        <button onClick={handlePlay} className="block sm:hidden sm:group-hover:block text-white" aria-label={isActive && isPlaying ? "Pause" : "Play"}>
          {isActive && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>

      {/* Image */}
      <img
        src={image || ""}
        alt={song.name}
        className="w-10 h-10 rounded object-cover bg-surface-lighter shrink-0"
        loading="lazy"
      />

      {/* Title & Artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-brand" : "text-white"}`}>
          {song.name}
        </p>
        <p className="text-xs text-text-muted truncate">
          {song.artists?.primary?.[0] ? (
            <Link to={`/artist/${song.artists.primary[0].id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
              {artists}
            </Link>
          ) : (
            artists
          )}
        </p>
      </div>

      {/* Album */}
      {song.album?.name && (
        <div className="hidden md:block flex-1 min-w-0 max-w-[200px]">
          {song.album.id ? (
            <Link to={`/album/${song.album.id}`} className="text-xs text-text-muted hover:underline truncate block" onClick={(e) => e.stopPropagation()}>
              {song.album.name}
            </Link>
          ) : (
            <span className="text-xs text-text-muted truncate block">{song.album.name}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}
          className={`opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${liked ? "!opacity-100" : ""}`}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={14} className={liked ? "fill-brand text-brand" : "text-text-muted hover:text-white"} />
        </button>
        <span className="text-xs text-text-muted w-10 text-right">{formatDuration(song.duration)}</span>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-text-muted hover:text-white transition-opacity"
            aria-label="More options"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-6 bg-surface-lighter rounded-lg shadow-xl border border-white/10 py-1 z-50 w-40">
                <button
                  onClick={(e) => { e.stopPropagation(); addToQueue(song); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-surface-hover"
                >
                  <Plus size={14} /> Add to queue
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(song); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-surface-hover"
                >
                  <Heart size={14} /> {liked ? "Remove from favorites" : "Add to favorites"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

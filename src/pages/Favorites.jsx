import { useFavorites } from "../contexts/FavoritesContext";
import { usePlayer } from "../contexts/PlayerContext";
import SongRow from "../components/SongRow";
import { Heart, Play, Shuffle } from "lucide-react";

export default function Favorites() {
  const { favoritesList } = useFavorites();
  const { playQueue } = usePlayer();

  const handlePlayAll = () => {
    const playable = favoritesList.filter((s) => s.downloadUrl?.length);
    if (playable.length) playQueue(playable, 0);
  };

  const handleShuffle = () => {
    const playable = favoritesList.filter((s) => s.downloadUrl?.length);
    if (playable.length) {
      const shuffled = [...playable].sort(() => Math.random() - 0.5);
      playQueue(shuffled, 0);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-8">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl bg-gradient-to-br from-brand/80 to-purple-900 flex items-center justify-center shadow-2xl">
          <Heart size={64} className="text-white" fill="currentColor" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Playlist</span>
          <h1 className="text-2xl md:text-5xl font-extrabold text-white mt-1 mb-2">Liked Songs</h1>
          <p className="text-sm text-text-secondary">{favoritesList.length} songs</p>

          {favoritesList.length > 0 && (
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
          )}
        </div>
      </div>

      {favoritesList.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <Heart size={48} className="text-text-muted mb-4" />
          <p className="text-text-secondary text-sm">Songs you like will appear here</p>
          <p className="text-text-muted text-xs mt-1">Save songs by tapping the heart icon</p>
        </div>
      ) : (
        <div className="bg-surface-light/20 rounded-xl overflow-hidden">
          {favoritesList.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} songs={favoritesList} />
          ))}
        </div>
      )}
    </div>
  );
}

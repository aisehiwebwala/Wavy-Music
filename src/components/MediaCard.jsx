import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { getImageUrl } from "../api/helpers";
import { usePlayer } from "../contexts/PlayerContext";

export default function MediaCard({ item, type, subtitle }) {
  const { playTrack } = usePlayer();

  const image = getImageUrl(item.image, "500x500");
  const name = item.name || item.title;
  const isRound = type === "artist";

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "song" && item.downloadUrl) {
      playTrack(item);
    }
  };

  const card = (
    <div className="group relative p-3 rounded-xl hover:bg-surface-lighter transition-colors duration-200 cursor-pointer">
      <div className={`relative overflow-hidden ${isRound ? "rounded-full" : "rounded-lg"} aspect-square mb-3 bg-surface-lighter shadow-lg`}>
        {image && (
          <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        )}
        {type === "song" && (
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-brand flex items-center justify-center opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200 shadow-xl hover:scale-105"
            aria-label={`Play ${name}`}
          >
            <Play size={18} className="text-white ml-0.5" fill="currentColor" />
          </button>
        )}
      </div>
      <p className="text-sm font-semibold text-white truncate">{name}</p>
      {subtitle && <p className="text-xs text-text-secondary mt-0.5 truncate">{subtitle}</p>}
    </div>
  );

  if (type === "song") {
    return <div role="button" tabIndex={0} onClick={handlePlay} onKeyDown={(e) => e.key === "Enter" && handlePlay(e)}>{card}</div>;
  }

  const linkTo =
    type === "album" ? `/album/${item.id}` :
    type === "artist" ? `/artist/${item.id}` :
    type === "playlist" ? `/playlist/${item.id}` : "/";

  return <Link to={linkTo}>{card}</Link>;
}

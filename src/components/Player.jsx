import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Settings,
  ChevronDown,
} from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl, getArtistNames, formatDuration, getAvailableQualities } from "../api/helpers";
import { useState } from "react";
import { Link } from "react-router-dom";

const QUALITY_LABELS = {
  "320kbps": "320 kbps (High)",
  "160kbps": "160 kbps (Medium)",
  "96kbps": "96 kbps (Low)",
  "48kbps": "48 kbps (Very Low)",
  "12kbps": "12 kbps (Data Saver)",
};

function QualityModal({ audioQuality, setAudioQuality, availableQualities, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center px-6" onClick={onClose}>
      <div className="bg-surface-light w-full max-w-sm rounded-2xl p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Audio quality settings">
        <h3 className="text-white font-semibold mb-4">Audio Quality</h3>
        <div className="space-y-1">
          {Object.entries(QUALITY_LABELS).map(([key, label]) => {
            const available = availableQualities.includes(key);
            return (
              <button
                key={key}
                onClick={() => { if (available) { setAudioQuality(key); onClose(); } }}
                disabled={!available}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  audioQuality === key
                    ? "bg-brand/20 text-brand"
                    : available
                    ? "text-text-secondary hover:bg-surface-hover hover:text-white"
                    : "text-text-muted/40 cursor-not-allowed"
                }`}
              >
                <span>{label}</span>
                {audioQuality === key && <span className="text-brand text-xs font-bold">Active</span>}
                {!available && <span className="text-[10px] text-text-muted/40">N/A</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full mt-4 py-2.5 rounded-xl bg-surface-lighter text-text-secondary text-sm font-medium hover:text-white transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

function QueueModal({ queue, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-end justify-center" onClick={onClose}>
      <div className="bg-surface-light w-full max-w-lg rounded-t-2xl max-h-[60vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Play queue">
        <h3 className="text-white font-semibold mb-3">Queue ({queue.length})</h3>
        {queue.length === 0 && <p className="text-text-muted text-sm py-4 text-center">Queue is empty</p>}
        {queue.map((s, i) => (
          <div key={`${s.id}-${i}`} className="flex items-center gap-3 py-2 px-2 rounded hover:bg-surface-hover">
            <img src={getImageUrl(s.image, "50x50") || ""} alt={s.name} className="w-10 h-10 rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{s.name}</p>
              <p className="text-xs text-text-muted truncate">{getArtistNames(s.artists)}</p>
            </div>
            <span className="text-xs text-text-muted">{formatDuration(s.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    skipNext,
    skipPrev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    queue,
    audioQuality,
    setAudioQuality,
  } = usePlayer();

  const { toggleFavorite, isFavorite } = useFavorites();
  const [showQueue, setShowQueue] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);

  if (!currentSong) {
    return (
      <div className="h-16 sm:h-20 bg-surface border-t border-white/5 flex items-center justify-center">
        <p className="text-text-muted text-sm">Select a song to start playing</p>
      </div>
    );
  }

  const image = getImageUrl(currentSong.image, "150x150");
  const imageLarge = getImageUrl(currentSong.image, "500x500");
  const songName = currentSong.name;
  const artistNames = getArtistNames(currentSong.artists);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isFavorite(currentSong.id);
  const availableQualities = getAvailableQualities(currentSong.downloadUrl);

  const handleVolumeToggle = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  const artistLink = currentSong.artists?.primary?.[0] ? (
    <Link to={`/artist/${currentSong.artists.primary[0].id}`} className="hover:underline" onClick={() => setExpanded(false)}>
      {artistNames}
    </Link>
  ) : artistNames;

  // --- Mobile expanded fullscreen player ---
  if (expanded) {
    return (
      <div className="fixed inset-0 z-[60] bg-surface flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setExpanded(false)} className="text-text-secondary p-1" aria-label="Minimize player">
            <ChevronDown size={24} />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Now Playing</span>
          <button onClick={() => setShowQuality(true)} className="text-text-secondary p-1" aria-label="Audio quality">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <img
            src={imageLarge || image || ""}
            alt={`${songName} artwork`}
            className="w-full max-w-xs aspect-square rounded-2xl object-cover shadow-2xl bg-surface-lighter"
          />
        </div>

        <div className="px-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-white truncate">{songName}</p>
              <p className="text-sm text-text-secondary truncate">{artistLink}</p>
            </div>
            <button onClick={() => toggleFavorite(currentSong)} className="shrink-0 ml-3" aria-label={liked ? "Remove from favorites" : "Add to favorites"}>
              <Heart size={22} className={liked ? "fill-brand text-brand" : "text-text-muted"} />
            </button>
          </div>
        </div>

        <div className="px-6 mt-5">
          <div className="relative h-6 flex items-center">
            <div className="w-full h-1.5 bg-surface-lighter rounded-full">
              <div className="h-full bg-brand rounded-full transition-[width] duration-100" style={{ width: `${progress}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-text-muted">{formatDuration(currentTime)}</span>
            <span className="text-xs text-text-muted">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-7 py-4">
          <button onClick={toggleShuffle} className={shuffle ? "text-brand" : "text-text-muted"} aria-label={`Shuffle ${shuffle ? "on" : "off"}`}>
            <Shuffle size={20} />
          </button>
          <button onClick={skipPrev} className="text-white" aria-label="Previous track">
            <SkipBack size={28} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={28} className="text-black" fill="currentColor" />
            ) : (
              <Play size={28} className="text-black ml-1" fill="currentColor" />
            )}
          </button>
          <button onClick={skipNext} className="text-white" aria-label="Next track">
            <SkipForward size={28} fill="currentColor" />
          </button>
          <button onClick={toggleRepeat} className={repeat !== "off" ? "text-brand" : "text-text-muted"} aria-label={`Repeat ${repeat}`}>
            {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 pb-8 pt-2">
          <button onClick={() => setShowQueue(true)} className="flex flex-col items-center gap-1 text-text-muted" aria-label="View queue">
            <ListMusic size={20} />
            <span className="text-[10px]">Queue</span>
          </button>
          <button onClick={() => setShowQuality(true)} className="flex flex-col items-center gap-1 text-text-muted" aria-label="Change quality">
            <span className="text-xs font-medium text-text-secondary">{audioQuality}</span>
            <span className="text-[10px]">Quality</span>
          </button>
        </div>

        {showQueue && <QueueModal queue={queue} onClose={() => setShowQueue(false)} />}
        {showQuality && <QualityModal audioQuality={audioQuality} setAudioQuality={setAudioQuality} availableQualities={availableQualities} onClose={() => setShowQuality(false)} />}
      </div>
    );
  }

  // --- Compact player bar ---
  return (
    <>
      {showQueue && <QueueModal queue={queue} onClose={() => setShowQueue(false)} />}
      {showQuality && <QualityModal audioQuality={audioQuality} setAudioQuality={setAudioQuality} availableQualities={availableQualities} onClose={() => setShowQuality(false)} />}

      {/* MOBILE: compact bar with full-width progress on top */}
      <div className="sm:hidden bg-surface-light border-t border-white/5 z-30 relative">
        <div className="relative h-1 w-full bg-surface-lighter">
          <div className="h-full bg-brand transition-[width] duration-100" style={{ width: `${progress}%` }} />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute -top-2 left-0 w-full h-5 opacity-0 cursor-pointer"
            aria-label="Seek"
          />
        </div>
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => setExpanded(true)} role="button" aria-label="Expand player">
          <img src={image || ""} alt={`${songName} artwork`} className="w-11 h-11 rounded-lg object-cover bg-surface-lighter shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{songName}</p>
            <p className="text-xs text-text-secondary truncate">{artistNames}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(currentSong); }} className="shrink-0" aria-label={liked ? "Remove from favorites" : "Add to favorites"}>
            <Heart size={18} className={liked ? "fill-brand text-brand" : "text-text-muted"} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="shrink-0 ml-1" aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={22} className="text-white" fill="currentColor" /> : <Play size={22} className="text-white ml-0.5" fill="currentColor" />}
          </button>
        </div>
      </div>

      {/* DESKTOP: full controls bar */}
      <div className="hidden sm:flex h-20 bg-surface-light border-t border-white/5 px-4 items-center gap-4 z-30 relative">
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <img src={image || ""} alt={`${songName} artwork`} className="w-14 h-14 rounded-md object-cover bg-surface-lighter shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">{songName}</p>
            <p className="text-xs text-text-secondary truncate">{artistLink}</p>
          </div>
          <button onClick={() => toggleFavorite(currentSong)} className="shrink-0 ml-2" aria-label={liked ? "Remove from favorites" : "Add to favorites"}>
            <Heart size={16} className={liked ? "fill-brand text-brand" : "text-text-muted hover:text-white"} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1 max-w-[40%]">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle} className={shuffle ? "text-brand" : "text-text-muted hover:text-white"} aria-label={`Shuffle ${shuffle ? "on" : "off"}`}>
              <Shuffle size={16} />
            </button>
            <button onClick={skipPrev} className="text-text-secondary hover:text-white" aria-label="Previous track">
              <SkipBack size={18} fill="currentColor" />
            </button>
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={16} className="text-black" fill="currentColor" /> : <Play size={16} className="text-black ml-0.5" fill="currentColor" />}
            </button>
            <button onClick={skipNext} className="text-text-secondary hover:text-white" aria-label="Next track">
              <SkipForward size={18} fill="currentColor" />
            </button>
            <button onClick={toggleRepeat} className={repeat !== "off" ? "text-brand" : "text-text-muted hover:text-white"} aria-label={`Repeat ${repeat}`}>
              {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] text-text-muted w-10 text-right">{formatDuration(currentTime)}</span>
            <div className="flex-1 relative group">
              <div className="w-full h-1 bg-surface-lighter rounded-full">
                <div className="h-full bg-white rounded-full group-hover:bg-brand transition-colors" style={{ width: `${progress}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>
            <span className="text-[10px] text-text-muted w-10">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 w-[30%] justify-end">
          <button onClick={() => setShowQuality(true)} className="text-text-muted hover:text-white" aria-label="Audio quality">
            <Settings size={15} />
          </button>
          <button onClick={() => setShowQueue(true)} className="text-text-muted hover:text-white" aria-label="View queue">
            <ListMusic size={16} />
          </button>
          <button onClick={handleVolumeToggle} className="text-text-muted hover:text-white" aria-label={volume === 0 ? "Unmute" : "Mute"}>
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="relative w-24 group">
            <div className="w-full h-1 bg-surface-lighter rounded-full">
              <div className="h-full bg-white rounded-full group-hover:bg-brand transition-colors" style={{ width: `${volume * 100}%` }} />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </>
  );
}

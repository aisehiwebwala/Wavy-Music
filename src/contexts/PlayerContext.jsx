import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { getDownloadUrl, getAvailableQualities, getImageUrl, getArtistNames } from "../api/helpers";
import { getSongSuggestions } from "../api/client";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [audioQuality, setAudioQualityState] = useState(
    () => localStorage.getItem("wavy_audio_quality") || "320kbps"
  );

  const stateRef = useRef({ queue, currentIndex, shuffle, repeat, audioQuality });
  stateRef.current = { queue, currentIndex, shuffle, repeat, audioQuality };

  const currentSong = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  const playSongAudio = useCallback((song) => {
    const quality = stateRef.current.audioQuality;
    const url = getDownloadUrl(song.downloadUrl, quality);
    if (!url) return;
    const audio = audioRef.current;
    audio.src = url;
    audio.play().catch(() => {});
  }, []);

  const setAudioQuality = useCallback((q) => {
    setAudioQualityState(q);
    localStorage.setItem("wavy_audio_quality", q);
    stateRef.current.audioQuality = q;
    const { queue: qu, currentIndex: ci } = stateRef.current;
    const song = ci >= 0 && ci < qu.length ? qu[ci] : null;
    if (song) {
      const audio = audioRef.current;
      const time = audio.currentTime;
      const wasPlaying = !audio.paused;
      const url = getDownloadUrl(song.downloadUrl, q);
      if (url) {
        audio.src = url;
        audio.currentTime = time;
        if (wasPlaying) audio.play().catch(() => {});
      }
    }
  }, []);

  const doSkipNext = useCallback(async () => {
    const { queue: q, currentIndex: ci, shuffle: sh, repeat: rp } = stateRef.current;
    if (q.length === 0) return;
    let nextIdx;
    if (sh) {
      nextIdx = Math.floor(Math.random() * q.length);
    } else {
      nextIdx = ci + 1;
    }

    if (nextIdx >= q.length) {
      if (rp === "all") {
        nextIdx = 0;
      } else {
        try {
          const lastSong = q[q.length - 1];
          const suggestions = await getSongSuggestions(lastSong.id);
          if (suggestions && suggestions.length) {
            setQueue((prev) => [...prev, ...suggestions]);
            nextIdx = q.length;
            setCurrentIndex(nextIdx);
            playSongAudio(suggestions[0]);
            return;
          } else {
            return;
          }
        } catch {
          return;
        }
      }
    }

    setCurrentIndex(nextIdx);
    playSongAudio(q[nextIdx]);
  }, [playSongAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      const rp = stateRef.current.repeat;
      if (rp === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        doSkipNext();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [doSkipNext, volume]);

  const playTrack = useCallback((song) => {
    setQueue([song]);
    setCurrentIndex(0);
    playSongAudio(song);
  }, [playSongAudio]);

  const playQueue = useCallback((songs, startIndex = 0) => {
    if (!songs.length) return;
    setQueue(songs);
    setCurrentIndex(startIndex);
    playSongAudio(songs[startIndex]);
  }, [playSongAudio]);

  const addToQueue = useCallback((song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const skipNext = doSkipNext;

  const skipPrev = useCallback(() => {
    const audio = audioRef.current;
    const { queue: q, currentIndex: ci } = stateRef.current;
    if (audio.currentTime > 3 || ci === 0) {
      audio.currentTime = 0;
      return;
    }
    const prevIdx = ci - 1;
    setCurrentIndex(prevIdx);
    playSongAudio(q[prevIdx]);
  }, [playSongAudio]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v) => {
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const toggleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current.play().catch(() => {});
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", skipPrev);
      navigator.mediaSession.setActionHandler("nexttrack", skipNext);
    }
  }, [skipPrev, skipNext]);

  useEffect(() => {
    if ("mediaSession" in navigator && currentSong) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentSong.name || currentSong.title || "Unknown Track",
        artist: getArtistNames(currentSong.artists) || "Unknown Artist",
        artwork: [
          {
            src: getImageUrl(currentSong.image, "500x500") || "",
            sizes: "500x500",
            type: "image/jpeg",
          },
        ],
      });
    }
  }, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        playTrack,
        playQueue,
        addToQueue,
        togglePlay,
        skipNext,
        skipPrev,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        audioQuality,
        setAudioQuality,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

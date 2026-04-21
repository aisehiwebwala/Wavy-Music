import { useParams } from "react-router-dom";
import { getArtist } from "../api/client";
import { useApi } from "../hooks/useApi";
import { getImageUrl, formatCount } from "../api/helpers";
import SongRow from "../components/SongRow";
import MediaCard from "../components/MediaCard";
import Section from "../components/Section";
import { SkeletonGrid, SkeletonList } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { usePlayer } from "../contexts/PlayerContext";
import { Play, Shuffle, CheckCircle } from "lucide-react";

export default function Artist() {
  const { id } = useParams();
  const { data: artist, loading, error, refetch } = useApi(() => getArtist(id), [id]);
  const { playQueue } = usePlayer();

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col items-center md:flex-row md:items-end gap-6 mb-8 animate-pulse">
          <div className="w-40 h-40 md:w-52 md:h-52 bg-surface-lighter rounded-full shrink-0" />
          <div>
            <div className="h-4 bg-surface-lighter rounded w-16 mb-2" />
            <div className="h-10 bg-surface-lighter rounded w-64 mb-3" />
            <div className="h-4 bg-surface-lighter rounded w-32" />
          </div>
        </div>
        <SkeletonList count={5} />
        <div className="mt-8"><SkeletonGrid /></div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!artist) return null;

  const image = getImageUrl(artist.image, "500x500");
  const topSongs = artist.topSongs || [];
  const topAlbums = artist.topAlbums || [];
  const singles = artist.singles || [];
  const similarArtists = artist.similarArtists || [];

  const handlePlayAll = () => {
    const playable = topSongs.filter((s) => s.downloadUrl?.length);
    if (playable.length) playQueue(playable, 0);
  };

  const handleShuffle = () => {
    const playable = topSongs.filter((s) => s.downloadUrl?.length);
    if (playable.length) {
      const shuffled = [...playable].sort(() => Math.random() - 0.5);
      playQueue(shuffled, 0);
    }
  };

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {image && (
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center md:items-end gap-6 p-4 md:p-8">
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl shrink-0 bg-surface-lighter border-2 border-white/10">
            {image && <img src={image} alt={artist.name} className="w-full h-full object-cover" />}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              {artist.isVerified && <CheckCircle size={16} className="text-brand" />}
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Artist</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-text-secondary justify-center md:justify-start">
              {artist.fanCount && <span>{formatCount(artist.fanCount)} fans</span>}
              {artist.followerCount && <span>&middot; {formatCount(artist.followerCount)} followers</span>}
              {artist.dominantLanguage && <span>&middot; {artist.dominantLanguage}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8">
        {/* Play buttons */}
        {topSongs.length > 0 && (
          <div className="flex items-center gap-3 my-6">
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

        {/* Top songs */}
        {topSongs.length > 0 && (
          <Section title="Popular">
            <div className="bg-surface-light/20 rounded-xl overflow-hidden">
              {topSongs.slice(0, 10).map((song, i) => (
                <SongRow key={song.id} song={song} index={i} songs={topSongs} />
              ))}
            </div>
          </Section>
        )}

        {/* Top albums */}
        {topAlbums.length > 0 && (
          <Section title="Albums">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {topAlbums.slice(0, 6).map((album) => (
                <MediaCard key={album.id} item={album} type="album" subtitle={album.year || album.description} />
              ))}
            </div>
          </Section>
        )}

        {/* Singles */}
        {singles.length > 0 && (
          <Section title="Singles">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {singles.slice(0, 6).map((single) => (
                <MediaCard key={single.id} item={single} type="song" subtitle={single.year} />
              ))}
            </div>
          </Section>
        )}

        {/* Similar artists */}
        {similarArtists.length > 0 && (
          <Section title="Fans Also Like">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {similarArtists.slice(0, 6).map((a) => (
                <MediaCard key={a.id} item={a} type="artist" subtitle={a.dominantType} />
              ))}
            </div>
          </Section>
        )}

        {/* Bio */}
        {artist.bio?.length > 0 && artist.bio[0]?.text && (
          <Section title="About">
            <div className="bg-surface-light/30 rounded-xl p-6 max-w-2xl">
              {artist.bio.map((b, i) => (
                <div key={i}>
                  {b.title && <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>}
                  {b.text && <p className="text-sm text-text-secondary leading-relaxed">{b.text}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

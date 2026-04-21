import { NavLink } from "react-router-dom";
import { Home, Search, Heart, Library, X, Music, Disc3, Mic2 } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { getImageUrl, getArtistNames } from "../api/helpers";

export default function Sidebar({ open, onClose }) {
  const { favoritesList } = useFavorites();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-surface-lighter text-white" : "text-text-secondary hover:text-white hover:bg-surface-hover"
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-surface flex flex-col border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <img src="/headphone-favicon-logo.png" alt="Wavy logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold text-white">Wavy</span>
          </NavLink>
          <button className="lg:hidden text-text-secondary hover:text-white" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink to="/" className={linkClass} onClick={onClose}>
            <Home size={20} />
            Home
          </NavLink>
          <NavLink to="/search" className={linkClass} onClick={onClose} end>
            <Search size={20} />
            Search
          </NavLink>
          <NavLink to="/favorites" className={linkClass} onClick={onClose}>
            <Heart size={20} />
            Favorites
          </NavLink>
        </nav>

        <div className="mt-5 px-3">
          <div className="flex items-center gap-2 px-3 py-2 text-text-secondary">
            <Search size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Browse</span>
          </div>
          <nav className="space-y-0.5 mt-1">
            <NavLink to="/search/songs" className={linkClass} onClick={onClose}>
              <Music size={18} />
              Songs
            </NavLink>
            <NavLink to="/search/albums" className={linkClass} onClick={onClose}>
              <Disc3 size={18} />
              Albums
            </NavLink>
            <NavLink to="/search/artists" className={linkClass} onClick={onClose}>
              <Mic2 size={18} />
              Artists
            </NavLink>
          </nav>
        </div>

        <div className="mt-6 px-3">
          <div className="flex items-center gap-2 px-3 py-2 text-text-secondary">
            <Library size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">Your Library</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 mt-2 space-y-0.5">
          {favoritesList.length === 0 && (
            <p className="px-3 py-4 text-text-muted text-xs">
              Songs you like will appear here.
            </p>
          )}
          {favoritesList.slice(0, 50).map((song) => (
            <NavLink
              key={song.id}
              to={`/song/${song.id}`}
              className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-surface-hover transition-colors group"
              onClick={onClose}
            >
              <img
                src={getImageUrl(song.image, "50x50") || ""}
                alt={song.name}
                className="w-8 h-8 rounded object-cover bg-surface-lighter"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{song.name}</p>
                <p className="text-xs text-text-muted truncate">{getArtistNames(song.artists)}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}

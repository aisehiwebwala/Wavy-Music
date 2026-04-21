import { createContext, useContext, useState, useCallback, useEffect } from "react";

const FavoritesContext = createContext(null);

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("wavy_favorites") || "{}");
  } catch {
    return {};
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem("wavy_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((song) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[song.id]) {
        delete next[song.id];
      } else {
        next[song.id] = {
          id: song.id,
          name: song.name || song.title,
          image: song.image,
          artists: song.artists,
          downloadUrl: song.downloadUrl,
          duration: song.duration,
          album: song.album,
        };
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => !!favorites[id], [favorites]);

  const favoritesList = Object.values(favorites);

  return (
    <FavoritesContext.Provider value={{ favorites, favoritesList, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

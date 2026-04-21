import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import SearchSongs from "./pages/SearchSongs";
import SearchAlbums from "./pages/SearchAlbums";
import SearchArtists from "./pages/SearchArtists";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Playlist from "./pages/Playlist";
import Favorites from "./pages/Favorites";
import SongDetail from "./pages/SongDetail";

export default function App() {
  return (
    <BrowserRouter basename="/Wavy-Music/">
      <FavoritesProvider>
        <PlayerProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="search/songs" element={<SearchSongs />} />
              <Route path="search/albums" element={<SearchAlbums />} />
              <Route path="search/artists" element={<SearchArtists />} />
              <Route path="album/:id" element={<Album />} />
              <Route path="artist/:id" element={<Artist />} />
              <Route path="playlist/:id" element={<Playlist />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="song/:id" element={<SongDetail />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="h-dvh w-full max-w-full flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-white/5 shrink-0 z-20">
            <button
              className="lg:hidden text-text-secondary hover:text-white"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="lg:hidden shrink-0">
              <img src={`${import.meta.env.BASE_URL}/headphone-favicon-logo.png`} alt="Wavy" className="w-7 h-7 rounded object-contain" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-md min-w-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs, artists, albums..."
                  className="w-full bg-surface-lighter rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-text-muted outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
                />
              </div>
            </form>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <Outlet />
          </main>
        </div>
      </div>
      <Player />
    </div>
  );
}

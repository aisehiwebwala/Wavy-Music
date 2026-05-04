const BASE = "https://saavn.sumit.co/api";
const PROXY = "https://middle-request-handler.vercel.app/api"

// Check local storage to persist the user's selection (defaults to true)
let useProxy = typeof window !== "undefined"
  ? localStorage.getItem("use_proxy") == "true"
  : false;

export function toggleProxy(enable) {
  useProxy = enable;
  if (typeof window !== "undefined") {
    localStorage.setItem("use_proxy", enable);
  }
}

export function isProxyEnabled() {
  return useProxy;
}

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, v);
  }

  let res;
  if (useProxy) {
    res = await fetch(PROXY, {
      method: "GET",
      headers: {
        "req_url": url.href
      }
    });
  } else {
    res = await fetch(url);
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("API returned unsuccessful response");
  return json.data;
}

export function globalSearch(query) {
  return request("/search", { query });
}

export function searchSongs(query, page = 1, limit = 20) {
  return request("/search/songs", { query, page, limit });
}

export function searchAlbums(query, page = 1, limit = 20) {
  return request("/search/albums", { query, page, limit });
}

export function searchArtists(query, page = 1, limit = 20) {
  return request("/search/artists", { query, page, limit });
}

export function searchPlaylists(query, page = 1, limit = 20) {
  return request("/search/playlists", { query, page, limit });
}

export function getSongById(id) {
  return request(`/songs/${encodeURIComponent(id)}`);
}

export function getSongs(ids) {
  return request("/songs", { ids });
}

export function getSongSuggestions(id) {
  return request(`/songs/${encodeURIComponent(id)}/suggestions`);
}

export function getAlbum(id) {
  return request("/albums", { id });
}

export function getArtist(id) {
  return request(`/artists/${encodeURIComponent(id)}`);
}

export function getArtistSongs(id, page = 1) {
  return request(`/artists/${encodeURIComponent(id)}/songs`, { page });
}

export function getArtistAlbums(id, page = 1) {
  return request(`/artists/${encodeURIComponent(id)}/albums`, { page });
}

export function getPlaylist(id, page = 1, limit = 50) {
  return request("/playlists", { id, page, limit });
}

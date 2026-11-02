
const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

// Use env-configured API URL, or fallback to production URL (for static builds)
export const API_BASE_URL =
  rawApiBaseUrl && rawApiBaseUrl.length > 0
    ? rawApiBaseUrl
    : process.env.NODE_ENV === "production"
    ? "https://shanviatech.com:3001/api/v1/admin"
    : "http://localhost:3001/api/v1/admin";

// Socket.IO server origin (survey chat popup). The API base lives under
// /api/v1/admin, but the socket connects to the server root.
// Mirrors API_BASE_URL's NODE_ENV fallback above. Without that check this
// defaulted to production unconditionally, so a local popup opened a socket to
// shanviatech.com while its HTTP calls went to localhost — admin presence and
// chat silently never worked in dev.
const rawSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();

export const SOCKET_BASE_URL =
  rawSocketUrl && rawSocketUrl.length > 0
    ? rawSocketUrl
    : process.env.NODE_ENV === "production"
    ? "https://shanviatech.com:3001"
    : "http://localhost:3001";

export const config = {
  baseURL: API_BASE_URL,
  socketURL: SOCKET_BASE_URL,
};

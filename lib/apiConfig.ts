/**
 * Resolves the client base URL and API base URL.
 * Defaults to http://localhost:5000 if NEXT_PUBLIC_CLIENT_BASE_URL is not set.
 * Safely handles trailing slashes and ensures /api is appended without duplication.
 */
export const CLIENT_BASE_URL = (
  process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export const API_BASE_URL = `${CLIENT_BASE_URL}/api`;

export default API_BASE_URL;


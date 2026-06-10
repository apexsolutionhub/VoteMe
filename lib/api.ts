import axios from "axios";

import { clearAuth, getAccessToken, getRefreshToken, setAuth } from "@/lib/auth";

const defaultBaseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined" ? "/api" : "http://127.0.0.1:8000/api");

const api = axios.create({
  baseURL: defaultBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

function usesNextProxy(baseURL: string | undefined) {
  const base = baseURL ?? defaultBaseURL;
  return base === "/api" || base.endsWith("/api");
}

/** Next.js 308-redirects trailing slashes and breaks POST bodies — strip them for the proxy. */
function stripProxyTrailingSlash(
  url: string | undefined,
  baseURL: string | undefined,
) {
  if (!url?.endsWith("/") || url.length <= 1) return url;
  if (!usesNextProxy(baseURL)) return url;
  return url.slice(0, -1);
}

api.interceptors.request.use((config) => {
  config.url = stripProxyTrailingSlash(
    config.url,
    config.baseURL ?? defaultBaseURL,
  );

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refresh = getRefreshToken();
      if (!refresh) {
        clearAuth();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        const refreshBase = process.env.NEXT_PUBLIC_API_URL ?? "/api";
        const refreshPath = usesNextProxy(refreshBase)
          ? "/auth/refresh"
          : "/auth/refresh/";
        refreshPromise = axios
          .post(`${refreshBase}${refreshPath}`, { refresh })
          .then((res) => {
            const access = res.data.access as string;
            localStorage.setItem("voteme_access", access);
            return access;
          })
          .catch(() => {
            clearAuth();
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccess = await refreshPromise;
      if (!newAccess) return Promise.reject(error);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;

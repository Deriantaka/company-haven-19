import { useEffect, useState } from "react";

export const API_BASE_URL = "http://localhost:8080/api/v1";
const TOKEN_KEY = "vibsense.token";
const listeners = new Set<() => void>();

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export function isAuthed(): boolean {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
}

export async function signIn(username: string, password: string) {
  const data = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (data && data.Token) {
    localStorage.setItem(TOKEN_KEY, data.Token);
  } else if (data && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  } else {
    throw new Error("Invalid response from server");
  }

  listeners.forEach((l) => l());
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
  listeners.forEach((l) => l());
}

export function useAuth() {
  const [authed, setAuthed] = useState(() => (typeof window !== "undefined" ? isAuthed() : false));
  useEffect(() => {
    const fn = () => setAuthed(isAuthed());
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return authed;
}

export async function switchThetaProject(projectId: string | number) {
  return fetchApi(`/theta/project/${projectId}`, { method: "PUT" });
}

export async function getThetaDevices() {
  return fetchApi(`/theta/getdevice`, { method: "GET" });
}

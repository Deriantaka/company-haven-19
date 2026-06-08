import { useEffect, useState } from "react";

const KEY = "vibsense.auth";
const listeners = new Set<() => void>();

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
export function signIn() {
  localStorage.setItem(KEY, "1");
  listeners.forEach((l) => l());
}
export function signOut() {
  localStorage.removeItem(KEY);
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

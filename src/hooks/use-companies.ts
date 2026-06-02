import { useEffect, useState } from "react";
import type { Company } from "@/components/CompanyCard";

const KEY = "companies.v1";

const seed: Company[] = [
  { id: "1", name: "Indah Kiat", location: "Serang" },
  { id: "2", name: "Givaudan Indonesia", location: "Depok" },
  { id: "3", name: "Tjiwi Kimia", location: "Mojokerto" },
  { id: "4", name: "PT. Jembo Cable", location: "Tangerang" },
  { id: "5", name: "Youngnam Korea", location: "Seoul" },
  { id: "6", name: "Sensor Labs", location: "Bandung" },
];

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setCompanies(raw ? JSON.parse(raw) : seed);
    } catch {
      setCompanies(seed);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(companies));
  }, [companies, loaded]);

  const add = (name: string, location: string) =>
    setCompanies((c) => [...c, { id: crypto.randomUUID(), name, location }]);
  const remove = (id: string) => setCompanies((c) => c.filter((x) => x.id !== id));
  const setIcon = (id: string, icon: string) =>
    setCompanies((c) => c.map((x) => (x.id === id ? { ...x, icon } : x)));

  return { companies, add, remove, setIcon };
}
import { useEffect, useState, useCallback } from "react";

export type Entity = { id: string; name: string; parentId?: string; icon?: string; map?: string };
export type CompanyEntity = Entity & { location: string };

export type StoreData = {
  companies: CompanyEntity[];
  factories: Entity[];
  groups: Entity[];
  lines: Entity[];
  sections: Entity[];
  sensors: Entity[];
};

const KEY = "vibsense.store.v1";

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const seed = (): StoreData => {
  const c1 = "c-tjiwi";
  const c2 = "c-indah";
  const c3 = "c-givaudan";
  const f1 = "f-papermill-a";
  const g1 = "g-pm1";
  const g2 = "g-pm2";
  const g3 = "g-pm7";
  const l1 = "l-newsensor-pm1";
  const l2 = "l-2nd-dryer";
  const l3 = "l-3rd-dryer";
  const s1 = "s-vibsense-pm1";
  return {
    companies: [
      { id: c1, name: "Tjiwi Kimia AM 1", location: "Mojokerto" },
      { id: c2, name: "Indah Kiat", location: "Serang" },
      { id: c3, name: "Givaudan Indonesia", location: "Depok" },
      { id: "c-jembo", name: "PT. Jembo Cable", location: "Tangerang" },
      { id: "c-youngnam", name: "Youngnam Korea", location: "Seoul" },
      { id: "c-sensor", name: "Sensor Labs", location: "Bandung" },
    ],
    factories: [{ id: f1, name: "PAPER MILL A", parentId: c1 }],
    groups: [
      { id: g1, name: "PM1", parentId: f1 },
      { id: g2, name: "PM2", parentId: f1 },
      { id: g3, name: "PM7", parentId: f1 },
    ],
    lines: [
      { id: l1, name: "New Sensor PM1", parentId: g1 },
      { id: l2, name: "New Sensor PM1 2nd Dryer", parentId: g1 },
      { id: l3, name: "New Sensor PM1 3rd Dryer", parentId: g1 },
    ],
    sections: [{ id: "sec-vibsense", name: "VIBSENSE SENSOR PM1", parentId: l1 }],
    sensors: [
      { id: s1, name: "Gear Box Wire Drive 1", parentId: "sec-vibsense" },
      { id: "s-roll-back", name: "Roll 1P Back Side 20", parentId: "sec-vibsense" },
      { id: "s-motor-suc", name: "Motor 1P Suction 17", parentId: "sec-vibsense" },
      { id: "s-roll-front", name: "Roll 1P Front Side 19", parentId: "sec-vibsense" },
    ],
  };
};

function load(): StoreData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed();
}

let cache: StoreData | null = null;
const listeners = new Set<() => void>();

function getStore(): StoreData {
  if (!cache) cache = load();
  return cache;
}
function setStore(s: StoreData) {
  cache = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  const data = getStore();

  const update = useCallback((mut: (s: StoreData) => StoreData) => setStore(mut(getStore())), []);

  type Key = keyof StoreData;
  const addItem = (key: Key, name: string, parentId?: string, extra?: Partial<CompanyEntity>) => {
    const item: any = { id: uid(), name, parentId, ...(extra ?? {}) };
    update((s) => ({ ...s, [key]: [...(s[key] as Entity[]), item] }));
    return item.id as string;
  };
  const removeItem = (key: Key, id: string) => {
    update((s) => ({ ...s, [key]: (s[key] as Entity[]).filter((x) => x.id !== id) }));
  };
  const updateItem = (key: Key, id: string, patch: Partial<Entity & CompanyEntity>) => {
    update((s) => ({
      ...s,
      [key]: (s[key] as Entity[]).map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  };

  return { data, addItem, removeItem, updateItem };
}

export function findById<T extends Entity>(arr: T[], id: string): T | undefined {
  return arr.find((x) => x.id === id);
}

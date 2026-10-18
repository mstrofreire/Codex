// Non-obvious findings, computed from the verified data (no hand-typed numbers).
import { DATA, byId, type Prov } from "./data";

const CCAA: Record<string, string[]> = {
  "Castilla y León": ["05", "09", "24", "34", "37", "40", "42", "47", "49"],
  "País Vasco": ["01", "20", "48"],
};
const sum = (ids: string[], k: "pop" | "seats") => ids.reduce((n, id) => n + byId[id][k], 0);
export const region = (name: string) => ({ name, pop: sum(CCAA[name], "pop"), seats: sum(CCAA[name], "seats") });

// Smallest provinces (excluding Ceuta/Melilla) whose combined population stays below `targetId`.
export const smallBlock = (targetId: string) => {
  const small = DATA.provs.filter((p) => !["51", "52"].includes(p.id)).sort((a, b) => a.pop - b.pop);
  const out: Prov[] = [];
  let pop = 0;
  for (const p of small) {
    if (pop + p.pop >= byId[targetId].pop) break;
    out.push(p);
    pop += p.pop;
  }
  return { provs: out, pop, seats: out.reduce((n, p) => n + p.seats, 0), target: byId[targetId] };
};

// LOREG art. 162: 2 seats per province, 248 by population (largest remainder). Ceuta/Melilla: 1 each.
type P = { id: string; pop: number };
const PROVS: P[] = DATA.provs.filter((p) => !["51", "52"].includes(p.id)).map(({ id, pop }) => ({ id, pop }));
const allocate = (ps: P[]) => {
  const q = ps.reduce((n, p) => n + p.pop, 0) / 248;
  const r = ps.map((p) => ({ id: p.id, s: 2 + Math.floor(p.pop / q), rem: (p.pop / q) % 1 }));
  const left = 248 - r.reduce((n, x) => n + x.s - 2, 0);
  [...r].sort((a, b) => b.rem - a.rem).slice(0, left).forEach((x) => x.s++);
  return Object.fromEntries(r.map((x) => [x.id, x.s])) as Record<string, number>;
};
const BASE = allocate(PROVS);

// Smallest population change (sign +1 gain / -1 loss) that changes `id`'s seat count.
export const popToFlip = (id: string, sign: 1 | -1) => {
  let lo = 0, hi = 500000;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    const next = allocate(PROVS.map((p) => (p.id === id ? { ...p, pop: p.pop + sign * m } : p)));
    if (next[id] !== BASE[id]) hi = m;
    else lo = m + 1;
  }
  return lo;
};

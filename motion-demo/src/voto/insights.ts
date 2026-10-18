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

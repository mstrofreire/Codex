import raw from "./data.json";

export type Prov = { id: string; name: string; seats: number; pop: number; perSeat: number; weight: number };
export const DATA = raw as { total: number; avgPerSeat: number; provs: Prov[] };
export const byId = Object.fromEntries(DATA.provs.map((p) => [p.id, p])) as Record<string, Prov>;
export const MOST = DATA.provs[0]; // fewest inhabitants per seat
export const MADRID = byId["28"];
export const RATIO = MADRID.perSeat / MOST.perSeat;
export const SOURCE = "Cálculo por habitantes (no por censo electoral). Fuente: INE, cifras oficiales del Padrón a 1-1-2025 · Escaños: Real Decreto de convocatoria del 29-N";

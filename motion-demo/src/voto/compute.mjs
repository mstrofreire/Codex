// Joins INE population (Padrón 1-1-2025) with 2026 seats -> src/voto/data.json
// Usage: node src/voto/compute.mjs <ine-province-rows.txt>
import { readFileSync, writeFileSync } from "node:fs";
import { SEATS } from "./seats2026.mjs";

const NAMES = {
  "01": "Álava", "03": "Alicante", "07": "Baleares", "12": "Castellón", "15": "A Coruña",
  "17": "Girona", "20": "Gipuzkoa", "26": "La Rioja", "35": "Las Palmas", "38": "S. C. de Tenerife",
  "46": "Valencia", "48": "Bizkaia", "25": "Lleida",
};
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => l.split(";"));
const pop = {};
for (const r of rows) {
  if (r[5] !== "2025") continue;
  const [code, ...rest] = r[1].split(" ");
  pop[code] = { name: NAMES[code] ?? rest.join(" "), pop: Number(r[6].replace(/\./g, "")) };
}
const missing = Object.keys(SEATS).filter((c) => !pop[c]);
if (missing.length) throw new Error("Faltan provincias: " + missing.join(", "));

const total = Object.values(pop).reduce((n, p) => n + p.pop, 0);
const avg = total / 350;
const provs = Object.entries(SEATS)
  .map(([id, seats]) => {
    const perSeat = Math.round(pop[id].pop / seats);
    return { id, name: pop[id].name, seats, pop: pop[id].pop, perSeat, weight: +(avg / perSeat).toFixed(3) };
  })
  .sort((a, b) => a.perSeat - b.perSeat);
writeFileSync("src/voto/data.json", JSON.stringify({ total, avgPerSeat: Math.round(avg), provs }, null, 1));
console.log("total", total, "media hab/escaño", Math.round(avg));
for (const p of [...provs.slice(0, 6), ...provs.slice(-6)]) console.log(p.name.padEnd(18), p.seats, p.perSeat, p.weight);

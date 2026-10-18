// Precomputes the Galicia map (SVG paths + pin positions) used by the reel.
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/es-atlas/es/provinces.json", "utf8"));
const GALICIA = ["15", "27", "32", "36"];
const provs = feature(topo, topo.objects.provinces).features.filter((f) => GALICIA.includes(f.id));
const fc = { type: "FeatureCollection", features: provs };

const W = 900, H = 900;
const proj = geoMercator().fitSize([W, H], fc);
const path = geoPath(proj);

const PINS = {
  coruna: [-8.4115, 43.3623],
  santiago: [-8.5448, 42.8782],
  baiona: [-8.8516, 42.1181],
};
const out = {
  width: W,
  height: H,
  provinces: provs.map((f) => ({ id: f.id, name: f.properties.name, d: path(f) })),
  pins: Object.fromEntries(Object.entries(PINS).map(([k, ll]) => [k, proj(ll).map((n) => Math.round(n))])),
  // pixels per km at A Coruña, for the "≤30 min" radius
  pxPerKm: (() => {
    const a = proj(PINS.coruna), b = proj([PINS.coruna[0], PINS.coruna[1] + 1 / 111.32]);
    return Math.abs(a[1] - b[1]);
  })(),
};
writeFileSync("src/galicia.json", JSON.stringify(out));
console.log(out.pins, out.pxPerKm.toFixed(2), out.provinces.map((p) => p.name));

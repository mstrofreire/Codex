// Precomputes the Spain provinces map for the vote-weight video:
// peninsula + Baleares + Ceuta/Melilla fill the frame, Canarias goes in a bottom-left inset.
// Run from motion-demo/: node src/voto/build-map.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoConicConformal, geoPath } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/es-atlas/es/provinces.json", "utf8"));
const all = feature(topo, topo.objects.provinces).features.filter((f) => f.id !== "54");
const CANARIAS = ["35", "38"];
const main = all.filter((f) => !CANARIAS.includes(f.id));
const canary = all.filter((f) => CANARIAS.includes(f.id));

const W = 900, H = 760;
const INSET = { x: 0, y: H - 190, w: 300, h: 190 };
const pMain = geoConicConformal().rotate([3.5, 0]).parallels([37, 43]).fitExtent([[0, 0], [W, H - 30]], { type: "FeatureCollection", features: main });
const pCan = geoConicConformal().rotate([15.5, 0]).parallels([27, 29])
  .fitExtent([[INSET.x + 16, INSET.y + 16], [INSET.x + INSET.w - 16, INSET.y + INSET.h - 16]], { type: "FeatureCollection", features: canary });

const shape = (f, proj) => {
  const path = geoPath(proj);
  return { id: f.id, name: f.properties.name, d: path(f), c: path.centroid(f).map(Math.round) };
};
writeFileSync(
  "src/voto/spain.json",
  JSON.stringify({ width: W, height: H, inset: INSET, provinces: [...main.map((f) => shape(f, pMain)), ...canary.map((f) => shape(f, pCan))] }),
);
console.log(all.length, "circunscripciones");

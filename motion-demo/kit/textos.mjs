// Post copy for each provincial card, built only from the facts (no hand-typed numbers).
import { MEDIA, art, con, dip, esc, fmt, party, pct } from "./datos.mjs";

export const CARDS = ["Escanos", "Ajustado", "Faltan", "Reparto"];
export const FILE = { Escanos: "1-escanos.png", Ajustado: "2-ajustado.png", Faltan: "3-faltan.png", Reparto: "4-reparto.png" };
const TAG = " #29N";
export const en29N = (p) => (p.escanos2026 === 1 ? "El 29-N se elige 1 diputado." : `El 29-N se reparten ${esc(p.escanos2026)}.`);
export const unoMas = (p) => (p.mayoritaria ? "ganar el escaño" : "un diputado más");

export const TEXTOS = {
  Escanos: (p) => {
    const d = p.escanos2026 - p.escanos2023;
    const cambio = d === 0 ? "" : `, ${Math.abs(d) === 1 ? "uno" : Math.abs(d)} ${d > 0 ? "más" : "menos"} que en 2023`;
    const cada = p.escanos2026 === 1 ? "Representa" : "Cada uno representa";
    return `${p.nombre} elige ${dip(p.escanos2026)} el 29-N${cambio}. ${cada} a ${fmt(p.habPorEscano)} habitantes; la media de España es ${fmt(MEDIA)}.${TAG}`;
  },
  Ajustado: (p) => {
    const a = p.ajustado;
    const [g, l] = [party(p, a.gana), party(p, a.pierde)];
    return `En 2023, ${con("a", g)} le faltaron ${fmt(a.votos)} votos en ${p.nombre} para ${a.barrera ? "superar el 3 % y " : ""}quitarle ${p.mayoritaria ? "el" : "un"} diputado ${con("a", l)}. ${en29N(p)}${TAG}`;
  },
  Faltan: (p) => {
    const rows = p.partidos.filter((x) => x.faltan !== null).sort((x, y) => x.faltan - y.faltan).slice(0, 3);
    const list = rows.map((x) => `${art(x)}, ${fmt(x.faltan)}`).join("; ");
    return `Votos que le faltaron a cada partido en ${p.nombre} para ${unoMas(p)} en 2023: ${list}. Datos oficiales${p.mayoritaria ? "" : ", ley D'Hondt"}.${TAG}`;
  },
  Reparto: (p) => {
    const reparto = p.escanos2023 === 1 ? `decidió el escaño de ${p.nombre}` : `repartieron los ${p.escanos2023} escaños de ${p.nombre}`;
    return `Así se ${reparto} en 2023. Participación: ${pct(p.participacion)}. El ${pct(p.pctSinEscano)} de los votos válidos fue a partidos sin escaño.${TAG}`;
  },
};

export const posts = (p) => CARDS.map((id) => ({ id, file: FILE[id], texto: TEXTOS[id](p) }));

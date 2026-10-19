// Guards between Grok's output and anything that gets published:
//  · numbers: every figure in a draft must exist in the province's official facts;
//  · evidence: links must be X posts, and (with the API) among the URLs the search actually returned;
//  · poll blackout: LOREG art. 69.7 bans publishing polls in the 5 days before 29-N.
import { MEDIA } from "./datos.mjs";

// Spanish-formatted numbers: 1.234.567 · 31.625,5 · 19,1 · 285
const NUM = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g;
export const numeros = (texto) => (String(texto).match(NUM) ?? []).map((s) => Number(s.replace(/\./g, "").replace(",", ".")));

// Figures that may appear in a post about the elections without being province facts.
const COMUNES = [2023, 2026, 23, 29, 52, 350, 176, 3, 1, 100, MEDIA];

// Every number in a province's facts (rounded as displayed), plus the derived ones the cards show.
export const permitidos = (p, extra = []) => {
  const out = new Set([...COMUNES, ...extra]);
  const walk = (v) => {
    if (typeof v === "number") {
      out.add(v);
      out.add(Math.abs(v));
      out.add(Math.round(v));
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(p);
  for (const x of p.partidos) out.add(x.escanos + 1);
  return out;
};

export const guardaTexto = (texto, p, extra) => {
  const ok = permitidos(p, extra);
  const desconocidos = numeros(texto).filter((n) => !ok.has(n));
  return { ok: desconocidos.length === 0, desconocidos };
};

const STATUS = /^https:\/\/(?:www\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d+)/;
export const normalizaPost = (url) => {
  const m = STATUS.exec(String(url).trim());
  return m ? `https://x.com/${m[1].toLowerCase()}/status/${m[2]}` : null;
};

// Each link: is it an X post, and did the search return it? (citas = [] -> cannot tell)
export const evidencias = (urls, citas = []) => {
  const vistos = new Set(citas.map(normalizaPost).filter(Boolean));
  return urls.map((url) => {
    const n = normalizaPost(url);
    return { url, valida: Boolean(n), verificada: n ? (vistos.size ? vistos.has(n) : null) : false };
  });
};

export const VEDA = { desde: "2026-11-24", hasta: "2026-11-29" };
const SONDEO = /encuesta|sondeo|\bCIS\b|estimaci[oó]n de voto|intenci[oó]n de voto|tracking|pie de urna/i;
export const enVeda = (fecha) => fecha >= VEDA.desde && fecha <= VEDA.hasta;
export const hablaDeSondeos = (texto) => SONDEO.test(texto);

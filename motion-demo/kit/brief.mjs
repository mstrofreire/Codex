// The contract between Grok and the kit: what Grok is asked, the JSON it must return,
// how that JSON is checked, and the publishing plan a person reviews before posting.
import { MEDIA, PROVS } from "./datos.mjs";
import { enVeda, evidencias, guardaTexto, hablaDeSondeos } from "./guardia.mjs";
import { FILE, TEXTOS } from "./textos.mjs";
import { MODELO } from "./grok.mjs";

export const ANGULOS = {
  escanos: { card: "Escanos", que: "cuántos diputados elige la provincia el 29-N y a cuántos habitantes representa cada uno (peso del voto, escaño ganado o perdido)" },
  ajustado: { card: "Ajustado", que: "el escaño que se decidió por menos votos en 2023 (voto útil, «mi voto no cuenta»)" },
  faltan: { card: "Faltan", que: "cuántos votos nuevos le faltaron a cada partido para un diputado más en 2023" },
  reparto: { card: "Reparto", que: "cómo se repartieron los escaños en 2023, la participación y los votos que no eligieron a nadie" },
};
const SENAL = ["alta", "media", "baja"];
const MAX = 280;

const str = (description) => ({ type: "string", description });
export const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: ["temas"],
  properties: {
    temas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["provincia", "tema", "resumen", "pregunta", "angulo", "gancho", "evidencias", "senal"],
        properties: {
          provincia: str("Código INE de 2 cifras de la circunscripción"),
          tema: str("De qué se habla, en una frase neutral"),
          resumen: str("2-3 frases: qué se dice y por qué ahora, sin tomar partido"),
          pregunta: str("La duda concreta que se repite en X y que un dato oficial puede responder"),
          angulo: { type: "string", enum: Object.keys(ANGULOS) },
          gancho: str(`Texto para el post (máx. ${MAX - 20} caracteres) con cifras de DATOS en formato español; vacío si no encaja ninguna`),
          evidencias: { type: "array", items: { type: "string" }, description: "URLs https://x.com/usuario/status/… de posts leídos" },
          senal: { type: "string", enum: SENAL },
        },
      },
    },
  },
};

export const ESQUEMA_MEDIOS = {
  type: "object",
  additionalProperties: false,
  required: ["medios"],
  properties: {
    medios: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["nombre", "usuario", "tipo", "evidencia"],
        properties: {
          nombre: str("Nombre del medio"),
          usuario: str("Usuario de X sin @"),
          tipo: { type: "string", enum: ["diario", "radio", "tv", "digital", "agencia", "otro"] },
          evidencia: str("URL de un post reciente suyo sobre las elecciones, o cadena vacía"),
        },
      },
    },
  },
};

// Compact facts: enough for Grok to pick the card and quote real numbers.
export const resumenDatos = (p) => ({
  provincia: p.code,
  nombre: p.nombre,
  escanos2026: p.escanos2026,
  escanos2023: p.escanos2023,
  habitantesPorDiputado: p.habPorEscano,
  mediaEspana: MEDIA,
  participacion2023: p.participacion,
  pctVotosSinEscano2023: p.pctSinEscano,
  partidos2023: p.partidos
    .filter((x) => x.escanos || x.pct >= 3)
    .map((x) => ({ nombre: x.nombre, votos: x.votos, pct: x.pct, escanos: x.escanos, votosParaUnoMas: x.faltan })),
  escanoMasAjustado2023: { gana: p.ajustado.gana, pierde: p.ajustado.pierde, votos: p.ajustado.votos },
});

const SISTEMA = `Eres el radar de una pequeña redacción de datos electorales en España. Detectas de qué se habla en X sobre las elecciones generales del 29 de noviembre de 2026 y eliges qué pieza de datos oficiales responde mejor a ese debate.

Reglas:
1. Usa la búsqueda en X. Cita solo posts que hayas leído, con su URL completa (https://x.com/usuario/status/…). Prefiere cuentas de medios, instituciones, partidos y periodistas; no expongas a particulares.
2. Sé neutral: describe el debate sin tomar partido ni calificar a nadie.
3. En "gancho" usa SOLO cifras que aparezcan en DATOS, en formato español (1.587; 19,1 %). No redondees ni calcules cifras nuevas. Si ninguna encaja, deja "gancho" vacío.
4. Nada de encuestas, sondeos ni estimaciones de voto en "gancho".
5. Responde solo con un objeto JSON válido que siga el formato pedido, sin texto alrededor.`;

const dia = (iso, d) => new Date(Date.parse(iso) + d * 864e5).toISOString().slice(0, 10);
export const ventana = (hoy, dias = 7) => ({ desde: dia(hoy, -dias), hasta: dia(hoy, 1) }); // hasta: exclusive

export const promptRadar = (provs, { desde, hasta }) => {
  const ambito = provs.length === 52 ? "toda España (52 circunscripciones)" : provs.map((p) => `${p.nombre} (${p.code})`).join(", ");
  const angulos = Object.entries(ANGULOS).map(([k, a]) => `- ${k}: ${a.que}`).join("\n");
  const usuario = `Ventana: posts publicados desde el ${desde} hasta el ${dia(hasta, -1)}, ambos incluidos.
Ámbito: ${ambito}.

Busca en X qué se discute sobre el 29-N en ese ámbito: dudas que se repiten, polémicas sobre el reparto de escaños, el voto útil, la participación o el peso del voto. Devuelve entre 3 y 8 temas, de más a menos conversación.

Para cada tema elige el ángulo de la pieza que mejor lo responde:
${angulos}

DATOS (oficiales; son las únicas cifras permitidas en "gancho"):
${JSON.stringify(provs.map(resumenDatos))}

Formato de salida: {"temas": [{"provincia": "17", "tema": "…", "resumen": "…", "pregunta": "…", "angulo": "ajustado", "gancho": "…", "evidencias": ["https://x.com/…/status/…"], "senal": "alta|media|baja"}]}`;
  return { sistema: SISTEMA, usuario };
};

export const promptMedios = (p) => ({
  sistema: "Eres documentalista de una agencia de datos. Usas la búsqueda en X y respondes solo con JSON válido.",
  usuario: `Busca en X las cuentas de medios de comunicación que cubren la actualidad de ${p.nombre} (periódicos, radios, televisiones y digitales locales o regionales). Solo organizaciones, nunca cuentas personales. Devuelve hasta 12, de más a menos activas en la última semana.
Para cada una: nombre, usuario (sin @), tipo (diario|radio|tv|digital|agencia|otro) y la URL de un post suyo reciente sobre las elecciones (o "" si no hay).
Formato de salida: {"medios": [{"nombre": "…", "usuario": "…", "tipo": "diario", "evidencia": "https://x.com/…/status/…"}]}`,
});

export const cuerpo = ({ sistema, usuario }, { esquema, nombre, herramienta = { type: "x_search" }, modelo = MODELO }) => ({
  model: modelo,
  input: [
    { role: "system", content: sistema },
    { role: "user", content: usuario },
  ],
  tools: [herramienta],
  text: { format: { type: "json_schema", name: nombre, schema: esquema, strict: true } },
  include: ["no_inline_citations"],
});

// Grok sometimes wraps JSON in prose or ```json fences (always, when pasted from the chat).
export const extraerJSON = (s) => {
  const t = String(s).trim();
  for (const c of [t, /```(?:json)?\s*([\s\S]*?)```/.exec(t)?.[1], t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1)]) {
    if (!c) continue;
    try {
      return JSON.parse(c);
    } catch {}
  }
  throw new Error("No encuentro un objeto JSON en la respuesta de Grok");
};

const isStr = (v) => typeof v === "string";
export const validarRadar = (obj) => {
  const errores = [];
  const temas = [];
  if (!obj || !Array.isArray(obj.temas)) return { temas, errores: ['Falta el array "temas"'] };
  obj.temas.forEach((t, i) => {
    const e = [];
    const code = isStr(t?.provincia) ? t.provincia.trim().padStart(2, "0") : "";
    if (!PROVS[code]) e.push(`provincia "${t?.provincia}" no es un código INE válido`);
    for (const k of ["tema", "resumen", "pregunta", "gancho"]) if (!isStr(t?.[k])) e.push(`"${k}" debe ser texto`);
    if (!ANGULOS[t?.angulo]) e.push(`ángulo "${t?.angulo}" desconocido`);
    if (!SENAL.includes(t?.senal)) e.push(`señal "${t?.senal}" desconocida`);
    if (!Array.isArray(t?.evidencias) || !t.evidencias.every(isStr)) e.push('"evidencias" debe ser una lista de URLs');
    if (e.length) errores.push(`tema ${i + 1}: ${e.join("; ")}`);
    else temas.push({ ...t, provincia: code });
  });
  return { temas, errores };
};

export const validarMedios = (obj) => {
  const ok = (m) => isStr(m?.nombre) && /^[A-Za-z0-9_]{1,15}$/.test(m?.usuario ?? "") && isStr(m?.tipo);
  const medios = (obj?.medios ?? []).filter(ok);
  return { medios, descartados: (obj?.medios?.length ?? 0) - medios.length };
};

// Decide what can be published for each topic: Grok's hook only if every number checks out.
export const revisar = (temas, { citas = [], fecha }) =>
  temas
    .map((t) => {
      const p = PROVS[t.provincia];
      const card = ANGULOS[t.angulo].card;
      const avisos = [];
      let texto = TEXTOS[card](p);
      let origen = "plantilla";
      const gancho = t.gancho.trim();
      if (gancho) {
        const g = guardaTexto(gancho, p);
        if (!g.ok) avisos.push(`gancho descartado: cifras que no están en los datos oficiales (${g.desconocidos.join(", ")})`);
        else if (gancho.length > MAX) avisos.push(`gancho descartado: ${gancho.length} caracteres (máx. ${MAX})`);
        else if (hablaDeSondeos(gancho)) avisos.push("gancho descartado: menciona encuestas o sondeos");
        else [texto, origen] = [gancho, "gancho de Grok, cifras verificadas"];
      }
      const bloqueado = enVeda(fecha) && hablaDeSondeos(`${t.tema} ${t.resumen} ${t.pregunta}`);
      if (bloqueado) avisos.push("BLOQUEADO: tema de encuestas durante la veda (LOREG art. 69.7, del 24 al 29 de noviembre)");
      const ev = evidencias(t.evidencias, citas);
      if (!ev.length) avisos.push("sin evidencias: comprueba en X que el tema existe");
      if (ev.some((x) => !x.valida)) avisos.push("hay enlaces que no son posts de X");
      if (ev.some((x) => x.verificada === false && x.valida)) avisos.push("hay enlaces que la búsqueda no devolvió: pueden ser inventados");
      return { ...t, nombre: p.nombre, slug: p.slug, card, archivo: FILE[card], texto, origen, evidencias: ev, avisos, bloqueado };
    })
    .sort((a, b) => SENAL.indexOf(a.senal) - SENAL.indexOf(b.senal));

const marca = (e) => (e.verificada ? "✓" : e.verificada === null ? "sin comprobar" : e.valida ? "⚠ no vista en la búsqueda" : "✗ no es un post");
export const planMarkdown = (r, meta) =>
  [
    `# Radar 29-N · ${meta.ambito} · ${meta.fecha}`,
    "",
    `Ventana ${meta.desde} → ${meta.hasta} (exclusivo) · ${meta.modo}${meta.coste != null ? ` · coste ${meta.coste.toFixed(4)} $` : ""} · ${r.length} temas`,
    "",
    ...r.flatMap((t, i) => [
      `## ${i + 1}. ${t.tema} · ${t.nombre} · señal ${t.senal}${t.bloqueado ? " · ⛔ BLOQUEADO" : ""}`,
      "",
      `- **Por qué ahora:** ${t.resumen}`,
      `- **Pregunta que se repite:** ${t.pregunta}`,
      `- **Pieza:** \`out/kit/${t.slug}/${t.archivo}\` → \`node kit/render.mjs ${t.slug} --solo ${t.card}\``,
      `- **Texto (${t.origen}):** ${t.texto}`,
      `- **Evidencias:** ${t.evidencias.map((e, j) => `[${j + 1}](${e.url}) ${marca(e)}`).join(" · ") || "ninguna"}`,
      ...t.avisos.map((a) => `- ⚠ ${a}`),
      "",
    ]),
    "---",
    "Antes de publicar: abre cada evidencia, revisa el texto y publícalo tú. Las cifras del texto ya están comprobadas contra los datos oficiales; el contexto del debate no.",
    "",
  ].join("\n");

export const mediosMarkdown = (p, medios) =>
  [
    `# Medios en X que cubren ${p.nombre}`,
    "",
    "Para contacto uno a uno (llamada, formulario o mensaje directo). Nada de envíos masivos por email: en España la LSSI (art. 21) exige consentimiento previo también entre empresas.",
    "",
    "| Medio | Cuenta | Tipo | Post reciente |",
    "|---|---|---|---|",
    ...medios.map((m) => `| ${m.nombre} | [@${m.usuario}](https://x.com/${m.usuario}) | ${m.tipo} | ${m.evidencia ? `[ver](${m.evidencia})` : "—"} |`),
    "",
  ].join("\n");

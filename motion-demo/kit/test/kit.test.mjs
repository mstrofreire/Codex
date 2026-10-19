// node --test kit/test   (no network: Grok responses below are hand-made fixtures in the documented shape)
import assert from "node:assert/strict";
import { test } from "node:test";
import { ANGULOS, ESQUEMA, cuerpo, extraerJSON, promptRadar, revisar, validarMedios, validarRadar, ventana } from "../brief.mjs";
import { PROVS, prov, provs } from "../datos.mjs";
import { citas, coste, responder, texto } from "../grok.mjs";
import { enVeda, evidencias, guardaTexto, hablaDeSondeos, numeros } from "../guardia.mjs";
import { CARDS, TEXTOS } from "../textos.mjs";

const ALL = Object.values(PROVS);
const girona = PROVS["17"];

test("facts: 52 constituencies whose seats add up and whose closest seat is the cheapest flip", () => {
  assert.equal(ALL.length, 52);
  assert.equal(ALL.reduce((n, p) => n + p.escanos2026, 0), 350);
  for (const p of ALL) {
    assert.equal(p.partidos.reduce((n, x) => n + x.escanos, 0), p.escanos2023, p.nombre);
    assert.equal(p.ajustado.votos, Math.min(...p.partidos.filter((x) => x.faltan !== null).map((x) => x.faltan)), p.nombre);
    const d = p.ajustado.duelo;
    if (d) assert.equal(d.pierde.cociente, Math.round((d.pierde.votos / d.pierde.divisor) * 10) / 10, p.nombre);
  }
  assert.deepEqual([girona.ajustado.gana, girona.ajustado.pierde, girona.ajustado.votos], ["PP", "Junts", 285]);
});

test("datos.prov resolves codes, slugs and official names", () => {
  assert.equal(prov("17").nombre, "Girona");
  assert.equal(prov("7").code, "07");
  assert.equal(prov("a coruña").code, "15");
  assert.equal(prov("Alacant").code, "03");
  assert.equal(prov("santa-cruz-de-tenerife").code, "38");
  assert.equal(prov("Atlántida"), undefined);
  assert.equal(provs(["all"]).length, 52);
});

test("every template post fits in a post and only uses official figures", () => {
  for (const p of ALL)
    for (const id of CARDS) {
      const t = TEXTOS[id](p);
      assert.ok(t.length <= 280, `${p.nombre}/${id}: ${t.length} caracteres`);
      assert.doesNotMatch(t, /undefined|NaN|null/, `${p.nombre}/${id}`);
      assert.deepEqual(guardaTexto(t, p).desconocidos, [], `${p.nombre}/${id}: ${t}`);
    }
});

test("numeros parses Spanish formatting", () => {
  assert.deepEqual(numeros("285 votos, 31.625,5 y 19,1 %"), [285, 31625.5, 19.1]);
  assert.deepEqual(numeros("El 29-N: 2.667.478 válidos; 1.587"), [29, 2667478, 1587]);
  assert.deepEqual(numeros("sin cifras"), []);
});

test("guardaTexto rejects figures that are not in the facts", () => {
  assert.equal(guardaTexto("Al PP le faltaron 285 votos en Girona.", girona).ok, true);
  assert.deepEqual(guardaTexto("Al PP le faltaron 300 votos; Junts sacó 63.251.", girona).desconocidos, [300]);
  assert.deepEqual(guardaTexto("Participación del 59,9 %, no del 61,2 %.", girona).desconocidos, [61.2]);
});

test("evidencias: only X posts, checked against what the search returned", () => {
  const citas = ["https://x.com/Medio_1/status/111", "https://example.com/noticia"];
  const ev = evidencias(["https://twitter.com/medio_1/status/111?s=20", "https://x.com/otro/status/222", "https://example.com/noticia"], citas);
  assert.deepEqual(ev.map((e) => [e.valida, e.verificada]), [[true, true], [true, false], [false, false]]);
  assert.equal(evidencias(["https://x.com/a/status/1"])[0].verificada, null); // manual mode: cannot tell
});

test("poll blackout covers 24–29 November", () => {
  assert.deepEqual(["2026-11-23", "2026-11-24", "2026-11-29", "2026-11-30"].map(enVeda), [false, true, true, false]);
  assert.ok(hablaDeSondeos("Nueva encuesta del CIS"));
  assert.ok(!hablaDeSondeos("El escaño más ajustado de 2023"));
});

test("extraerJSON copes with fences and prose", () => {
  const o = { temas: [] };
  assert.deepEqual(extraerJSON(JSON.stringify(o)), o);
  assert.deepEqual(extraerJSON("Aquí tienes:\n```json\n" + JSON.stringify(o) + "\n```\nSaludos"), o);
  assert.deepEqual(extraerJSON("Resultado: " + JSON.stringify(o) + " (fin)"), o);
  assert.throws(() => extraerJSON("no hay nada"), /JSON/);
});

const tema = (t) => ({
  provincia: "17", tema: "Debate sobre el voto útil en Girona", resumen: "Se discute si votar a partidos pequeños sirve.", pregunta: "¿Mi voto cuenta?",
  angulo: "ajustado", gancho: "", evidencias: ["https://x.com/medio/status/1"], senal: "media", ...t,
});

test("validarRadar keeps well-formed topics and explains the rest", () => {
  const { temas, errores } = validarRadar({ temas: [tema({ provincia: "7" }), tema({ provincia: "99" }), tema({ angulo: "encuesta" }), { tema: 1 }] });
  assert.equal(temas.length, 1);
  assert.equal(temas[0].provincia, "07");
  assert.equal(errores.length, 3);
  assert.deepEqual(validarRadar({}).errores, ['Falta el array "temas"']);
  assert.deepEqual(Object.keys(ANGULOS), ESQUEMA.properties.temas.items.properties.angulo.enum);
});

test("revisar uses Grok's hook only when its numbers check out, and blocks polls in the blackout", () => {
  const [bueno, inventado, sondeo] = revisar(
    [
      tema({ gancho: "En Girona, 285 votos decidieron un diputado en 2023. ¿Seguro que tu voto no cuenta? #29N", senal: "alta" }),
      tema({ gancho: "En Girona bastaron 150 votos.", senal: "media" }),
      tema({ tema: "Nueva encuesta en Girona", gancho: "", senal: "baja" }),
    ],
    { fecha: "2026-11-25" },
  );
  assert.equal(bueno.origen, "gancho de Grok, cifras verificadas");
  assert.equal(inventado.origen, "plantilla");
  assert.equal(inventado.texto, TEXTOS.Ajustado(girona));
  assert.match(inventado.avisos.join(), /150/);
  assert.ok(sondeo.bloqueado);
  assert.ok(!revisar([tema({ tema: "Nueva encuesta en Girona" })], { fecha: "2026-11-10" })[0].bloqueado);
});

test("validarMedios drops entries without a valid handle", () => {
  const { medios, descartados } = validarMedios({ medios: [{ nombre: "Diari", usuario: "diari_1", tipo: "diario", evidencia: "" }, { nombre: "X", usuario: "con espacio", tipo: "tv" }] });
  assert.equal(medios.length, 1);
  assert.equal(descartados, 1);
});

test("request body: X search over the window, strict JSON schema, no inline citations", () => {
  const v = ventana("2026-10-19", 7);
  assert.deepEqual(v, { desde: "2026-10-12", hasta: "2026-10-20" });
  const b = cuerpo(promptRadar([girona], v), { esquema: ESQUEMA, nombre: "radar", herramienta: { type: "x_search", from_date: v.desde, to_date: v.hasta } });
  assert.deepEqual(b.tools, [{ type: "x_search", from_date: "2026-10-12", to_date: "2026-10-20" }]);
  assert.equal(b.text.format.strict, true);
  assert.deepEqual(b.include, ["no_inline_citations"]);
  assert.match(b.input[1].content, /"escanoMasAjustado2023":\{"gana":"PP","pierde":"Junts","votos":285\}/);
});

test("grok client: request shape, response parsing and errors", async () => {
  const res = {
    output: [
      { type: "custom_tool_call", name: "x_search" },
      { type: "message", content: [{ type: "output_text", text: '{"temas":[]}', annotations: [{ type: "url_citation", url: "https://x.com/a/status/2" }] }] },
    ],
    citations: ["https://x.com/a/status/1"],
    usage: { cost_in_usd_ticks: 1_234_000_000 },
  };
  let sent;
  const fake = async (url, init) => ((sent = { url, init }), { ok: true, text: async () => JSON.stringify(res) });
  const out = await responder({ model: "m" }, { apiKey: "k", fetch: fake });
  assert.match(sent.url, /\/responses$/);
  assert.equal(sent.init.headers.Authorization, "Bearer k");
  assert.equal(texto(out), '{"temas":[]}');
  assert.deepEqual(citas(out), ["https://x.com/a/status/1", "https://x.com/a/status/2"]);
  assert.equal(coste(out), 0.1234);
  const fail = async () => ({ ok: false, status: 400, text: async () => "bad schema" });
  await assert.rejects(responder({}, { apiKey: "k", fetch: fail }), (e) => e.status === 400);
  await assert.rejects(responder({}, { apiKey: "" }), /XAI_API_KEY/);
});

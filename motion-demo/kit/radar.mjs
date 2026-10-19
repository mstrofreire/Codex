// Grok radar: what X is discussing about 29-N → which card answers it → a reviewed post.
//
//   node kit/radar.mjs prompt girona            # manual mode: paste the prompt into Grok (grok.com / X app)
//   node kit/radar.mjs ingest respuesta.txt     # check Grok's pasted answer and write the plan
//   node kit/radar.mjs run girona soria         # API mode (needs XAI_API_KEY); "all" = national radar
//   node kit/radar.mjs run all --dry            # print the request body, send nothing
//   node kit/radar.mjs plan kit/radar/<brief>.json
//   node kit/radar.mjs medios girona [--prompt] # local media on X, for one-to-one sales outreach
//
// Options: --dias N (search window, default 7) · --fecha AAAA-MM-DD (today, for the poll blackout)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  ESQUEMA, ESQUEMA_MEDIOS, cuerpo, extraerJSON, mediosMarkdown, planMarkdown, promptMedios, promptRadar, revisar, validarMedios, validarRadar, ventana,
} from "./brief.mjs";
import { PROVS, die, flags, prov, provs } from "./datos.mjs";
import { MODELO, citas, coste, responder, texto } from "./grok.mjs";

const DIR = path.join(import.meta.dirname, "radar");
const [cmd, ...rest] = process.argv.slice(2);
const opt = flags(rest);
const hoy = typeof opt.fecha === "string" ? opt.fecha : new Date().toISOString().slice(0, 10);
const v = ventana(hoy, Number(opt.dias ?? 7));
const ambitoDe = (ps) => (ps.length === 52 ? "nacional" : ps.map((p) => p.slug).join("+"));

const guardar = (nombre, brief) => {
  mkdirSync(DIR, { recursive: true });
  const base = path.join(DIR, nombre);
  writeFileSync(`${base}.json`, JSON.stringify(brief, null, 1));
  const md = planMarkdown(revisar(brief.temas, { citas: brief.citas, fecha: brief.fecha }), brief);
  writeFileSync(`${base}.md`, md);
  console.log(md);
  console.error(`Guardado: ${path.relative(process.cwd(), base)}.json y .md`);
};

const imprimirPrompt = ({ sistema, usuario }) => console.log(`${sistema}\n\n${usuario}\n`);

// Structured output with server-side tools is model-dependent: on a 400, retry without it.
const pedir = async (body) => {
  try {
    return await responder(body);
  } catch (e) {
    if (e.status !== 400 || !body.text) throw e;
    console.error(`Sin salida estructurada (${e.message.slice(0, 120)}…); reintento pidiendo JSON en el texto.`);
    const { text, ...sin } = body;
    return responder(sin);
  }
};

const usage = () =>
  die("Uso: node kit/radar.mjs <prompt|run|ingest|plan|medios> …  (detalles al principio de kit/radar.mjs y en kit/README.md)");

async function main() {
  switch (cmd) {
    case "prompt": {
      const ps = provs(opt._.length ? opt._ : ["all"]);
      console.error(`# Pega todo lo de abajo en Grok (grok.com o la app de X) y guarda su respuesta en un archivo.\n# Después: node kit/radar.mjs ingest <archivo> --fecha ${hoy}\n`);
      imprimirPrompt(promptRadar(ps, v));
      break;
    }
    case "run": {
      const ps = provs(opt._.length ? opt._ : ["all"]);
      const body = cuerpo(promptRadar(ps, v), { esquema: ESQUEMA, nombre: "radar", herramienta: { type: "x_search", from_date: v.desde, to_date: v.hasta } });
      if (opt.dry) {
        console.log(JSON.stringify(body, null, 1));
        break;
      }
      const res = await pedir(body);
      const { temas, errores } = validarRadar(extraerJSON(texto(res)));
      errores.forEach((e) => console.error(`Descartado ${e}`));
      const meta = { ambito: ambitoDe(ps), fecha: hoy, ...v, modo: `API · ${body.model}`, coste: coste(res), citas: citas(res) };
      guardar(`${hoy}-${meta.ambito}`, { ...meta, temas, errores });
      break;
    }
    case "ingest": {
      const [file] = opt._;
      if (!file) usage();
      const { temas, errores } = validarRadar(extraerJSON(readFileSync(file, "utf8")));
      errores.forEach((e) => console.error(`Descartado ${e}`));
      if (!temas.length) die("Ningún tema válido en la respuesta.");
      const codes = [...new Set(temas.map((t) => t.provincia))];
      const meta = { ambito: codes.length > 3 ? "nacional" : ambitoDe(codes.map((c) => PROVS[c])), fecha: hoy, ...v, modo: "manual (pegado desde Grok)", coste: null, citas: [] };
      guardar(`${hoy}-${meta.ambito}-manual`, { ...meta, temas, errores });
      break;
    }
    case "plan": {
      const [file] = opt._;
      if (!file) usage();
      const brief = JSON.parse(readFileSync(file, "utf8"));
      console.log(planMarkdown(revisar(brief.temas, { citas: brief.citas, fecha: brief.fecha }), brief));
      break;
    }
    case "medios": {
      const p = prov(opt._[0] ?? "") ?? die("Indica una provincia: node kit/radar.mjs medios girona");
      const pr = promptMedios(p);
      if (opt.prompt) {
        imprimirPrompt(pr);
        break;
      }
      const body = cuerpo(pr, { esquema: ESQUEMA_MEDIOS, nombre: "medios" });
      if (opt.dry) {
        console.log(JSON.stringify(body, null, 1));
        break;
      }
      const res = await pedir(body);
      const { medios, descartados } = validarMedios(extraerJSON(texto(res)));
      if (descartados) console.error(`Descartados ${descartados} resultados con datos incompletos`);
      mkdirSync(DIR, { recursive: true });
      const md = mediosMarkdown(p, medios);
      writeFileSync(path.join(DIR, `medios-${p.slug}.md`), md);
      console.log(md);
      const c = coste(res);
      if (c != null) console.error(`Coste: ${c.toFixed(4)} $ · modelo ${MODELO}`);
      break;
    }
    default:
      usage();
  }
}

main().catch((e) => die(e.message));

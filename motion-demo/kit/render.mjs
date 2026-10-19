// Renders the provincial kit: 4 cards (PNG 1080×1350) + POSTS.md per constituency.
//
//   node kit/render.mjs girona soria            # by name, slug or INE code
//   node kit/render.mjs all --marca @medio      # 52 kits with the client's handle in the corner
//   node kit/render.mjs 08 --solo Ajustado      # just one card type
//
// Options: --marca <texto> (default @tucuenta) · --out <dir> (default out/kit) · --solo <Escanos,Ajustado,Faltan,Reparto>
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { die, flags, provs } from "./datos.mjs";
import { CARDS, FILE, posts } from "./textos.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
// Same headless shell as remotion.config.ts; elsewhere Remotion finds or downloads its own.
const SHELL = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const opt = flags(process.argv.slice(2));
if (!opt._.length) die("Uso: node kit/render.mjs <provincia|código|all>... [--marca @medio] [--out out/kit] [--solo Ajustado,Faltan]");
const list = provs(opt._);
const marca = typeof opt.marca === "string" ? opt.marca : "@tucuenta";
if (marca.length > 32) die("--marca: máximo 32 caracteres");
const solo = typeof opt.solo === "string" ? opt.solo.split(",") : CARDS;
const bad = solo.filter((id) => !CARDS.includes(id));
if (bad.length) die(`--solo: tarjetas válidas: ${CARDS.join(", ")}`);
const outDir = path.resolve(ROOT, typeof opt.out === "string" ? opt.out : "out/kit");

const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(SHELL) ? SHELL : null);
console.log(`Empaquetando… (${list.length} provincias × ${solo.length} tarjetas)`);
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/voto/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable });

try {
  for (const p of list) {
    const dir = path.join(outDir, p.slug);
    mkdirSync(dir, { recursive: true });
    const inputProps = { code: p.code, marca };
    for (const id of solo) {
      const composition = await selectComposition({ serveUrl, id: `Prov-${id}`, inputProps, puppeteerInstance: browser });
      await renderStill({ composition, serveUrl, inputProps, output: path.join(dir, FILE[id]), puppeteerInstance: browser });
    }
    const rows = posts(p).filter((x) => solo.includes(x.id));
    writeFileSync(
      path.join(dir, "POSTS.md"),
      [
        `# Kit 29-N · ${p.nombre}`,
        "",
        `Marca: ${marca}. Imágenes 4:5 (1080×1350). Cifras de \`provincias.json\` (Interior 2023, INE 2025, Real Decreto 806/2026). Revisa cada texto antes de publicarlo.`,
        "",
        "| Imagen | Texto del post |",
        "|---|---|",
        ...rows.map((x) => `| \`${x.file}\` | ${x.texto} |`),
        "",
      ].join("\n"),
    );
    console.log(`✓ ${p.nombre} → ${path.relative(ROOT, dir)}`);
  }
} finally {
  await browser.close({ silent: true });
}

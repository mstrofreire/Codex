import { DISPLAY, FONT, MONO } from "../theme";
import a from "./congreso2023/analysis.json";
import grupos from "./congreso2023/grupos.json";
import { Frame, Headline } from "./cards";
import { DhondtTable } from "./DhondtTable";
import { fmt } from "./fmt";
import { V } from "./theme";

export const SRC23 = "Fuente: Ministerio del Interior, resultados oficiales del Congreso (23-J 2023). Cálculo propio con la ley D'Hondt (LOREG, art. 163).";
const SRC_POP = "Fuente: INE, cifras oficiales del Padrón a 1-1-2025 · Reparto de escaños según la LOREG, art. 162";
const K23 = "23-J 2023 · RESULTADOS OFICIALES";

// Orientative party colors, always shown next to the party's name.
export const COLOR: Record<string, string> = Object.fromEntries(
  Object.entries(grupos).filter(([k]) => k !== "_nota").map(([, g]) => [(g as { etiqueta: string }).etiqueta, (g as { color: string }).color]),
);
COLOR["EXISTE"] = "#2F9E6E";
COLOR["SY"] = "#4C9A2A";
const NAME: Record<string, string> = { SY: "Soria ¡Ya!", EXISTE: "Teruel Existe", VOX: "Vox", SUMAR: "Sumar", JUNTS: "Junts", CCa: "CC", "EAJ-PNV": "PNV" };
export const party = (s: string) => NAME[s] ?? s;
const CIRC: Record<string, string> = { "Araba/Álava": "Álava", "Castelló/Castellón": "Castellón", "Alacant/Alicante": "Alicante", "València/Valencia": "Valencia", "Santa Cruz de Tenerife": "S. C. de Tenerife" };
export const circ = (s: string) => CIRC[s] ?? s;
export const pct = (n: number) => n.toFixed(1).replace(".", ",") + " %";

export const Chip = ({ p }: { p: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
    <span style={{ width: 18, height: 18, borderRadius: 4, background: COLOR[p] ?? V.dim, display: "inline-block" }} />
    {party(p)}
  </span>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 28, lineHeight: 1.4, color: V.dim, marginTop: 40 }}>{children}</div>
);

// 1 · The tightest seat of 2023, with the D'Hondt table
export const CardGirona = () => {
  const f = a.ajustados[0];
  return (
    <Frame kicker="23-J 2023 · EL ESCAÑO MÁS AJUSTADO" src={SRC23}>
      <Headline>
        En {circ(f.circ)}, un diputado se decidió por <span style={{ color: "#6DA7EC" }}>{fmt(f.votos)} votos</span>.
      </Headline>
      <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 30 }}>
        La ley D'Hondt divide los votos de cada partido entre 1, 2, 3… Los <b>6 cocientes más altos</b> se llevan los 6 escaños.
      </div>
      <div style={{ marginTop: 40 }}>
        <DhondtTable code="17" lit={() => 1} scale={0.86} />
      </div>
      <Note>
        <span style={{ color: V.text }}>Junts</span> ya tenía un escaño, así que competía con sus votos ÷ 2 (31.625,5).{" "}
        <span style={{ color: V.text }}>El PP</span>, con sus votos enteros (31.341). Le faltaron {fmt(f.votos)}.
      </Note>
    </Frame>
  );
};

// 2 · Closest seats, one per constituency
export const CardAjustados = () => {
  const rows = a.ajustadoPorCirc.slice(0, 8);
  return (
    <Frame kicker={K23} src={SRC23}>
      <Headline size={68}>Los 8 diputados que se decidieron por menos votos</Headline>
      <div style={{ fontSize: 28, color: V.dim, marginTop: 16 }}>Votos que le faltaron al partido que se quedó fuera (→ a quién se lo habría quitado)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 40 }}>
        {rows.map((r) => (
          <div key={r.circ} style={{ display: "grid", gridTemplateColumns: "300px 1fr 130px", alignItems: "center", background: V.panel, borderRadius: 16, padding: "22px 26px" }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{circ(r.circ)}</div>
            <div style={{ fontSize: 26, color: V.dim, display: "flex", gap: 12, alignItems: "center" }}>
              <Chip p={r.gana} /> <span>→</span> <span style={{ opacity: 0.8 }}><Chip p={r.pierde} /></span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 36, textAlign: "right" }}>{fmt(r.votos)}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// 3 · Absolute majority: 6 seats short, one per province
export const CardMayoria = () => {
  const [pv, ps] = a.bloques;
  const items = pv.donde as [string, number, number, string, string][];
  return (
    <Frame kicker="23-J 2023 · MAYORÍA ABSOLUTA" src={SRC23}>
      <Headline size={68}>
        A PP y Vox les faltaron {pv.faltan} diputados para la mayoría absoluta. Costaban <span style={{ color: "#6DA7EC" }}>{fmt(pv.votos)} votos</span>.
      </Headline>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30 }}>
        <span style={{ fontFamily: MONO, fontSize: 34 }}>{pv.escanos}</span>
        <span style={{ fontSize: 28, color: V.dim }}>+</span>
        {items.map((_, i) => (
          <div key={i} style={{ width: 44, height: 44, borderRadius: "50%", background: "#6DA7EC" }} />
        ))}
        <span style={{ fontSize: 28, color: V.dim }}>=</span>
        <span style={{ fontFamily: MONO, fontSize: 34 }}>176</span>
        <span style={{ fontSize: 26, color: V.dim, marginLeft: 10 }}>uno en cada provincia:</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 30 }}>
        {items.map(([c, , v, who, lost]) => (
          <div key={c} style={{ background: V.panel, borderRadius: 18, padding: "18px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 32, fontWeight: 700 }}>{circ(c)}</span>
              <span style={{ fontSize: 22, color: "#6DA7EC", fontWeight: 600 }}>+1 diputado</span>
            </div>
            <div style={{ fontSize: 26, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
              <Chip p={who.split(" ")[0]} />
              <span style={{ fontFamily: MONO }}>+{fmt(v)}</span>
            </div>
            <div style={{ fontSize: 22, color: V.dim, marginTop: 4 }}>se lo quitaría a {party(lost)}</div>
          </div>
        ))}
      </div>
      <Note>
        Votos nuevos, sin quitárselos a nadie. PSOE y Sumar ({ps.escanos}) habrían necesitado {ps.faltan} diputados y {fmt(ps.votos)} votos.
      </Note>
    </Frame>
  );
};

// 4 · Highest share without a seat
export const CardSinEscano = () => {
  const rows = a.umbral.slice(0, 6);
  const top = rows[0];
  const max = top.maxPerdedorPct!;
  return (
    <Frame kicker={K23} src={SRC23}>
      <Headline>
        En {top.circ}, un partido sacó el {pct(max)} de los votos y se quedó sin diputado.
      </Headline>
      <div style={{ fontSize: 28, color: V.dim, marginTop: 18 }}>Mayor porcentaje sin escaño, por provincia</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 40 }}>
        {rows.map((r) => (
          <div key={r.circ}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 32, fontWeight: 700 }}>
                {circ(r.circ)} <span style={{ fontSize: 24, fontWeight: 400, color: V.dim }}>· {r.escanos} escaños en juego</span>
              </span>
              <span style={{ fontSize: 24, color: V.text }}>
                {party(r.maxPerdedor!)} <span style={{ color: V.dim }}>· 0 escaños</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <div style={{ height: 30, width: 760 * (r.maxPerdedorPct! / max), background: COLOR[r.maxPerdedor!] ?? V.dim, borderRadius: "0 6px 6px 0" }} />
              <span style={{ fontFamily: MONO, fontSize: 30, whiteSpace: "nowrap" }}>{pct(r.maxPerdedorPct!)}</span>
            </div>
          </div>
        ))}
      </div>
      <Note>
        En {top.circ}, el PSOE sí logró escaño con el {pct(top.minPct)}. Con solo {top.escanos} diputados en juego, el resto se queda fuera.
      </Note>
    </Frame>
  );
};

// 5 · Pure proportionality
export const CardProporcional = () => {
  const main = a.proporcional.filter((r) => ["PP", "PSOE", "VOX", "SUMAR"].includes(r.partido));
  return (
    <Frame kicker={K23} src={SRC23 + " Reparto proporcional: una sola circunscripción nacional de 350 escaños, sin barrera."}>
      <Headline>Si todos los votos valieran lo mismo en toda España</Headline>
      <div style={{ fontSize: 28, color: V.dim, marginTop: 16 }}>Escaños reales en 2023 frente a un reparto proporcional</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 50 }}>
        {main.map((r) => {
          const d = r.real - r.proporcional;
          return (
            <div key={r.partido}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 38, fontWeight: 700 }}>
                  <Chip p={r.partido} />
                </span>
                <span style={{ fontSize: 30, color: V.dim }}>
                  <span style={{ fontFamily: MONO, fontSize: 36, color: V.text }}>{r.real}</span> reales ·{" "}
                  <span style={{ fontFamily: MONO, fontSize: 36, color: V.text }}>{r.proporcional}</span> proporcionales
                  <span style={{ fontFamily: MONO, fontSize: 34, color: V.text, marginLeft: 18 }}>{d > 0 ? "+" : "−"}{Math.abs(d)}</span>
                </span>
              </div>
              <div style={{ position: "relative", height: 44, marginTop: 12 }}>
                <div style={{ position: "absolute", top: 0, height: 20, width: 900 * (r.real / 140), background: COLOR[r.partido], borderRadius: "0 5px 5px 0" }} />
                <div style={{ position: "absolute", top: 24, height: 20, width: 900 * (r.proporcional / 140), border: `2px solid ${COLOR[r.partido]}`, boxSizing: "border-box", borderRadius: "0 5px 5px 0" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 34, fontSize: 26, color: V.dim }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 30, height: 14, background: V.dim }} /> Escaños reales</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 30, height: 14, border: `2px solid ${V.dim}`, boxSizing: "border-box" }} /> Proporcionales</span>
      </div>
    </Frame>
  );
};

// 6 · Votes per seat
export const CardPrecio = () => {
  const rows = [...a.precio].sort((x, y) => x.votosPorEscano - y.votosPorEscano);
  const max = rows[rows.length - 1].votosPorEscano;
  return (
    <Frame kicker={K23} src={SRC23}>
      <Headline>Cuántos votos costó cada diputado</Headline>
      <div style={{ fontSize: 28, color: V.dim, marginTop: 16 }}>Votos totales del partido ÷ diputados obtenidos</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
        {rows.map((r) => (
          <div key={r.partido} style={{ display: "grid", gridTemplateColumns: "170px 1fr 200px", alignItems: "center", gap: 18 }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>{party(r.partido)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ height: 32, width: 400 * (r.votosPorEscano / max), background: COLOR[r.partido] ?? V.dim, borderRadius: "0 6px 6px 0" }} />
              <span style={{ fontFamily: MONO, fontSize: 28 }}>{fmt(r.votosPorEscano)}</span>
            </div>
            <span style={{ fontSize: 24, color: V.dim, textAlign: "right", whiteSpace: "nowrap" }}>{r.escanos} {r.escanos === 1 ? "diputado" : "diputados"}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// 7 · The seat that moves from Cádiz to Madrid
export const CardCadiz = () => {
  const cad = a.reparto2026.find((r) => r.circ === "Cádiz")!;
  const mad = a.reparto2026.find((r) => r.circ === "Madrid")!;
  const Panel = ({ title, sub, r }: { title: string; sub: string; r: typeof cad }) => (
    <div style={{ flex: 1, background: V.panel, borderRadius: 24, padding: "36px 36px" }}>
      <div style={{ fontSize: 40, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 26, color: V.dim, marginTop: 8 }}>{sub}</div>
      <div style={{ fontSize: 34, marginTop: 34 }}>
        <Chip p={r.partido} />
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 110, fontWeight: 700, marginTop: 14, lineHeight: 1 }}>
        {r.antes} <span style={{ color: V.dim, fontSize: 70 }}>→</span> {r.despues}
      </div>
    </div>
  );
  return (
    <Frame kicker="29-N · EL NUEVO REPARTO" src={"Fuente: Real Decreto de convocatoria del 29-N (escaños) y Ministerio del Interior (votos del 23-J 2023). Cálculo D'Hondt propio."}>
      <Headline>Cádiz pierde un diputado y Madrid lo gana. ¿A quién afecta?</Headline>
      <div style={{ fontSize: 30, color: V.dim, marginTop: 18 }}>Si se repitieran los votos de 2023 con el reparto del 29-N:</div>
      <div style={{ display: "flex", gap: 24, marginTop: 44 }}>
        <Panel title="Cádiz" sub="9 → 8 diputados" r={cad} />
        <Panel title="Madrid" sub="37 → 38 diputados" r={mad} />
      </div>
      <Note>Es un escenario: el 29-N los votos serán otros. Pero muestra que el cambio no es neutro.</Note>
    </Frame>
  );
};

// 8 · 102 fixed seats
export const CardFijos = () => (
  <Frame kicker="29-N · CÓMO SE REPARTEN LOS ESCAÑOS" src={SRC_POP}>
    <Headline>102 de los 350 diputados se reparten sin mirar cuánta gente vive en cada provincia.</Headline>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(25, 30px)", gap: 6, marginTop: 50 }}>
      {Array.from({ length: 350 }, (_, i) => (
        <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: i < 102 ? "#6DA7EC" : V.line }} />
      ))}
    </div>
    <Note>
      <span style={{ color: V.text }}>2 fijos por provincia</span> (50 × 2) y <span style={{ color: V.text }}>1 para Ceuta y otro para Melilla</span>. Solo los otros 248 se reparten según la población.
    </Note>
  </Frame>
);

// "¿Tu voto cuenta?" — vertical video with the final selection of insights.
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { DISPLAY, FONT, MONO } from "../theme";
import a from "./congreso2023/analysis.json";
import { HANDLE, SRC as SRC_POP } from "./cards";
import { COLOR, Chip, SRC23, circ, party, pct } from "./cards2";
import { fmt } from "./fmt";
import { smallBlock } from "./insights";
import { V } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (v: number, d = 40) => `translateY(${interpolate(v, [0, 1], [d, 0])}px)`;
const count = (frame: number, from: number, to: number, value: number) => interpolate(frame, [from, to], [0, value], clamp);
const BLUE = "#6DA7EC";

const Page = ({ children, kicker, src, top = 200 }: { children: React.ReactNode; kicker: string; src?: string; top?: number }) => (
  <AbsoluteFill style={{ background: V.bg, padding: `${top}px 90px 0`, fontFamily: FONT, color: V.text }}>
    <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 7, color: V.dim }}>{kicker}</div>
    {children}
    {src && <div style={{ position: "absolute", left: 90, right: 90, bottom: 90, fontSize: 25, lineHeight: 1.4, color: V.dim }}>{src}</div>}
  </AbsoluteFill>
);

const Title = ({ children, o, size = 96 }: { children: React.ReactNode; o: number; size?: number }) => (
  <div style={{ fontFamily: DISPLAY, fontSize: size, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3.5, marginTop: 30, opacity: o, transform: up(o) }}>{children}</div>
);

// 0 · Hook
const Hook = () => {
  const x = useEnter(4);
  const y = useEnter(30);
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: "0 90px", justifyContent: "center", fontFamily: FONT, color: V.text }}>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 7, color: V.dim, opacity: x }}>ELECCIONES 29-N · DATOS OFICIALES</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, fontWeight: 700, lineHeight: 1, letterSpacing: -5, marginTop: 36, opacity: x, transform: up(x, 50) }}>
          ¿Crees que tu voto no cuenta?
        </div>
        <div style={{ fontSize: 50, color: V.dim, marginTop: 50, opacity: y }}>Mira lo que pasó en 2023.</div>
      </AbsoluteFill>
    </Scene>
  );
};

// 1 · Girona: 285 votes
const Girona = () => {
  const frame = useCurrentFrame();
  const t = useEnter(0);
  const n = count(frame, 20, 75, a.ajustados[0].votos);
  const bars = interpolate(frame, [95, 150], [0, 1], clamp);
  const e = 1 - Math.pow(1 - bars, 3);
  const note = useEnter(170);
  const Q = ({ p, votes, div, q, won, delay }: { p: string; votes: number; div: number; q: string; won?: boolean; delay: number }) => {
    const o = useEnter(90 + delay);
    return (
      <div style={{ opacity: o }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 40 }}>
          <span style={{ fontWeight: 700 }}>
            <Chip p={p} />
          </span>
          <span style={{ fontFamily: MONO, fontSize: 34, color: V.dim }}>
            {fmt(votes)} ÷ {div} = <span style={{ color: V.text }}>{q}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}>
          <div style={{ height: 40, width: 660 * ((votes / div) / 31625.5) * e, background: COLOR[p], borderRadius: "0 8px 8px 0" }} />
          <span style={{ fontSize: 30, color: won ? V.text : V.dim, opacity: bars }}>{won ? "Escaño" : "Fuera"}</span>
        </div>
      </div>
    );
  };
  return (
    <Scene>
      <Page kicker="23-J 2023 · GIRONA" src={SRC23}>
        <Title o={t}>Un diputado se decidió por</Title>
        <div style={{ fontFamily: DISPLAY, fontSize: 330, fontWeight: 700, letterSpacing: -14, lineHeight: 1, color: BLUE, marginTop: 30 }}>{fmt(n)}</div>
        <div style={{ fontSize: 56, color: V.dim, marginTop: 6 }}>votos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 44, marginTop: 90 }}>
          <Q p="JUNTS" votes={63251} div={2} q="31.625,5" won delay={0} />
          <Q p="PP" votes={31341} div={1} q="31.341" delay={10} />
        </div>
        <div style={{ fontSize: 40, lineHeight: 1.35, marginTop: 70, opacity: note, transform: up(note) }}>
          Junts se llevó el último escaño. Con 285 votos más, habría sido para el PP.
        </div>
      </Page>
    </Scene>
  );
};

// 2 · The 8 tightest seats
const Ajustados = () => {
  const frame = useCurrentFrame();
  const t = useEnter(0);
  return (
    <Scene>
      <Page kicker="23-J 2023 · NO FUE EL ÚNICO" src={SRC23}>
        <Title o={t} size={80}>Los 8 diputados que se decidieron por menos votos</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 50 }}>
          {a.ajustadoPorCirc.slice(0, 8).map((r, i) => {
            const s = 24 + i * 12;
            const o = useEnter(s);
            return (
              <div key={r.circ} style={{ background: V.panel, borderRadius: 20, padding: "20px 30px", display: "grid", gridTemplateColumns: "1fr 170px", alignItems: "center", opacity: o, transform: `translateX(${interpolate(o, [0, 1], [-60, 0])}px)` }}>
                <div>
                  <div style={{ fontSize: 38, fontWeight: 700 }}>{circ(r.circ)}</div>
                  <div style={{ fontSize: 28, color: V.dim, marginTop: 4, display: "flex", gap: 12, alignItems: "center" }}>
                    <Chip p={r.gana} /> <span>se lo habría quitado a</span> <Chip p={r.pierde} />
                  </div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 44, textAlign: "right" }}>{fmt(count(frame, s, s + 30, r.votos))}</div>
              </div>
            );
          })}
        </div>
      </Page>
    </Scene>
  );
};

// 3 · Absolute majority: running total over the 6 seats
const STEP = 28;
const Mayoria = () => {
  const frame = useCurrentFrame();
  const t = useEnter(0);
  const [pv, ps] = a.bloques;
  const items = pv.donde as [string, number, number, string][];
  let total = 0;
  items.forEach((d, i) => {
    const s = 40 + i * STEP;
    total += interpolate(frame, [s, s + STEP - 4], [0, d[2]], clamp);
  });
  const note = useEnter(40 + items.length * STEP + 20);
  return (
    <Scene>
      <Page kicker="23-J 2023 · MAYORÍA ABSOLUTA (176)" src={SRC23}>
        <Title o={t} size={88}>
          A PP y Vox les faltaron
        </Title>
        <div style={{ fontFamily: DISPLAY, fontSize: 230, fontWeight: 700, letterSpacing: -9, lineHeight: 1, color: BLUE, marginTop: 24 }}>{fmt(total)}</div>
        <div style={{ fontSize: 50, color: V.dim, marginTop: 6, opacity: t }}>votos para la mayoría absoluta</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 60 }}>
          {items.map(([c, , v, who], i) => {
            const o = useEnter(40 + i * STEP);
            return (
              <div key={c} style={{ background: V.panel, borderRadius: 20, padding: "24px 28px", opacity: o, transform: up(o, 30) }}>
                <div style={{ fontSize: 40, fontWeight: 700 }}>{circ(c)}</div>
                <div style={{ fontSize: 30, color: V.dim, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <Chip p={who.split(" ")[0]} />
                  <span style={{ fontFamily: MONO, color: V.text }}>+{fmt(v)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 36, lineHeight: 1.4, color: V.dim, marginTop: 50, opacity: note }}>
          Sumaron {pv.escanos} escaños. Votos nuevos, sin quitárselos a nadie. Con el mismo cálculo, PSOE y Sumar ({ps.escanos}) habrían necesitado {fmt(ps.votos)}.
        </div>
      </Page>
    </Scene>
  );
};

// 4 · Highest share without a seat
const SinEscano = () => {
  const frame = useCurrentFrame();
  const t = useEnter(0);
  const rows = a.umbral.slice(0, 6);
  const top = rows[0];
  const max = top.maxPerdedorPct!;
  const note = useEnter(150);
  return (
    <Scene>
      <Page kicker="23-J 2023 · VOTOS SIN DIPUTADO" src={SRC23}>
        <Title o={t} size={88}>
          En {top.circ}, un partido sacó el {pct(max)} de los votos y se quedó sin diputado.
        </Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 80 }}>
          {rows.map((r, i) => {
            const s = 40 + i * 10;
            const g = interpolate(frame, [s, s + 35], [0, 1], clamp);
            const e = 1 - Math.pow(1 - g, 3);
            return (
              <div key={r.circ} style={{ opacity: Math.min(1, g * 3) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 40, fontWeight: 700 }}>
                    {circ(r.circ)} <span style={{ fontSize: 28, fontWeight: 400, color: V.dim }}>· {r.escanos} escaños en juego</span>
                  </span>
                  <span style={{ fontSize: 30, color: V.text }}>
                    {party(r.maxPerdedor!)} <span style={{ color: V.dim }}>· 0 escaños</span>
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
                  <div style={{ height: 40, width: 700 * (r.maxPerdedorPct! / max) * e, background: COLOR[r.maxPerdedor!] ?? V.dim, borderRadius: "0 8px 8px 0" }} />
                  <span style={{ fontFamily: MONO, fontSize: 38, whiteSpace: "nowrap" }}>{pct(r.maxPerdedorPct! * e)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.4, color: V.text, marginTop: 70, opacity: note, transform: up(note) }}>
          Cuantos menos diputados reparte tu provincia, más votos se quedan sin representación.
        </div>
      </Page>
    </Scene>
  );
};

// 5 · Alicante vs 10 provinces (inhabitants: the legal basis for seats)
const Dots = ({ n, color, start, per = 6 }: { n: number; color: string; start: number; per?: number }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${per}, 48px)`, gap: 12, marginTop: 30 }}>
      {Array.from({ length: n }, (_, i) => {
        const o = interpolate(frame, [start + i * 2, start + i * 2 + 8], [0, 1], clamp);
        return <div key={i} style={{ width: 48, height: 48, borderRadius: "50%", background: color, opacity: o, transform: `scale(${0.5 + o * 0.5})` }} />;
      })}
    </div>
  );
};

const Alicante = () => {
  const frame = useCurrentFrame();
  const b = smallBlock("03");
  const t = useEnter(0);
  const l = useEnter(40);
  const r = useEnter(60);
  const punch = useEnter(190);
  const Col = ({ o, color, title, sub, pop, seats, start }: { o: number; color: string; title: string; sub?: string; pop: number; seats: number; start: number }) => (
    <div style={{ flex: 1, background: V.panel, borderRadius: 26, padding: "36px 36px", borderTop: `10px solid ${color}`, opacity: o, transform: up(o) }}>
      <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: 24, lineHeight: 1.35, color: V.dim, marginTop: 10 }}>{sub}</div>}
      <div style={{ fontFamily: MONO, fontSize: 46, marginTop: 26 }}>{fmt(count(frame, start, start + 40, pop))}</div>
      <div style={{ fontSize: 28, color: V.dim }}>habitantes</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 130, fontWeight: 700, lineHeight: 1, marginTop: 24 }}>{Math.round(count(frame, start + 40, start + 40 + seats * 2, seats))}</div>
      <div style={{ fontSize: 28, color: V.dim }}>diputados</div>
      <Dots n={seats} color={color} start={start + 40} />
    </div>
  );
  return (
    <Scene>
      <Page kicker="29-N · EL REPARTO DE ESCAÑOS" src={SRC_POP}>
        <Title o={t} size={84}>
          {b.provs.length} provincias juntas tienen menos habitantes que Alicante.
        </Title>
        <div style={{ display: "flex", gap: 28, marginTop: 60 }}>
          <Col o={l} color="#3987E5" title="Alicante" pop={b.target.pop} seats={b.target.seats} start={40} />
          <Col o={r} color="#D95926" title={`Estas ${b.provs.length} juntas`} sub={b.provs.map((p) => p.name).join(", ")} pop={b.pop} seats={b.seats} start={60} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2, marginTop: 60, opacity: punch, transform: up(punch) }}>
          Eligen {b.seats} diputados. <span style={{ color: V.dim }}>Alicante, {b.target.seats}.</span>
        </div>
      </Page>
    </Scene>
  );
};

// 6 · Close
const Outro = () => {
  const x = useEnter(4);
  const y = useEnter(34);
  const z = useEnter(60);
  return (
    <Scene fade={10}>
      <AbsoluteFill style={{ background: V.bg, padding: "0 90px", justifyContent: "center", fontFamily: FONT, color: V.text }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 118, fontWeight: 700, lineHeight: 1.04, letterSpacing: -4, opacity: x, transform: up(x) }}>
          El 29-N, tu voto puede decidir un diputado.
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 80, fontWeight: 600, lineHeight: 1.1, letterSpacing: -2.5, color: BLUE, marginTop: 50, opacity: y, transform: up(y) }}>
          Pero no vale lo mismo en todas partes.
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 100, opacity: z }}>{HANDLE}</div>
      </AbsoluteFill>
    </Scene>
  );
};

const SCENES = [
  { C: Hook, len: 90 },
  { C: Girona, len: 270 },
  { C: Ajustados, len: 240 },
  { C: Mayoria, len: 300 },
  { C: SinEscano, len: 240 },
  { C: Alicante, len: 270 },
  { C: Outro, len: 120 },
];
export const SELECCION_DURATION = SCENES.reduce((n, s) => n + s.len, 0);

export const Seleccion = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {SCENES.map(({ C, len }, i) => {
        const seq = (
          <Sequence key={i} from={from} durationInFrames={len}>
            <C />
          </Sequence>
        );
        from += len;
        return seq;
      })}
    </AbsoluteFill>
  );
};

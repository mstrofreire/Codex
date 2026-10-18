import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { DISPLAY, FONT, MONO } from "../theme";
import spain from "./spain.json";
import { DATA, MADRID, MOST, RATIO, SOURCE, byId } from "./data";
import { fmt, fmt1 } from "./fmt";
import { BINS, V, binOf } from "./theme";

const PAD = "0 90px";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (v: number, d = 40) => `translateY(${interpolate(v, [0, 1], [d, 0])}px)`;

const Kicker = ({ children, o = 1 }: { children: React.ReactNode; o?: number }) => (
  <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 600, letterSpacing: 8, color: V.dim, opacity: o }}>{children}</div>
);
const Source = () => (
  <div style={{ position: "absolute", bottom: 90, left: 90, right: 90, fontFamily: FONT, fontSize: 26, color: V.dim, lineHeight: 1.35 }}>
    {SOURCE}
  </div>
);

export const Hook = () => {
  const a = useEnter(4);
  const b = useEnter(18);
  const c = useEnter(44);
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: PAD, justifyContent: "center" }}>
        <Kicker o={a}>ELECCIONES 29-N · DATOS</Kicker>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, fontWeight: 700, lineHeight: 1, letterSpacing: -5, color: V.text, marginTop: 36, opacity: b, transform: up(b, 50) }}>
          Tu voto no pesa lo mismo en toda España.
        </div>
        <div style={{ fontFamily: FONT, fontSize: 48, color: V.dim, marginTop: 56, opacity: c }}>Depende de tu provincia.</div>
      </AbsoluteFill>
    </Scene>
  );
};

const DuelCard = ({ name, perSeat, seats, color, start }: { name: string; perSeat: number; seats: number; color: string; start: number }) => {
  const frame = useCurrentFrame();
  const e = useEnter(start);
  const n = interpolate(frame, [start + 6, start + 40], [0, perSeat], clamp);
  return (
    <div style={{ background: V.panel, borderRadius: 28, padding: "44px 50px", opacity: e, transform: up(e), borderLeft: `10px solid ${color}` }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 700, color: V.text, letterSpacing: -2 }}>{name}</div>
      <div style={{ fontFamily: FONT, fontSize: 36, color: V.dim, marginTop: 10 }}>
        {seats} diputados · 1 por cada
      </div>
      <div style={{ fontFamily: MONO, fontSize: 104, color: V.text, marginTop: 8 }}>{fmt(n)}</div>
      <div style={{ fontFamily: FONT, fontSize: 36, color: V.dim }}>habitantes</div>
    </div>
  );
};

export const Duel = () => {
  const frame = useCurrentFrame();
  const r = useEnter(100);
  const ratio = interpolate(frame, [100, 135], [1, RATIO], clamp);
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: PAD, justifyContent: "center", gap: 40 }}>
        <DuelCard name={MOST.name} perSeat={MOST.perSeat} seats={MOST.seats} color={V.more2} start={6} />
        <DuelCard name={MADRID.name} perSeat={MADRID.perSeat} seats={MADRID.seats} color={V.less2} start={40} />
        <div style={{ fontFamily: DISPLAY, fontSize: 70, fontWeight: 600, lineHeight: 1.12, letterSpacing: -2, color: V.text, marginTop: 30, opacity: r, transform: up(r) }}>
          Un voto en {MOST.name} pesa <span style={{ color: V.more2 }}>{fmt1(ratio)} veces</span> lo que uno en {MADRID.name}.
        </div>
        <Source />
      </AbsoluteFill>
    </Scene>
  );
};

// Provinces reveal from most to least weight.
const order = Object.fromEntries(DATA.provs.map((p, i) => [p.id, i]));
// Label anchor positions (map px), placed in empty space with a leader line.
const LABELS: Record<string, [number, number, "start" | "end"]> = {
  "42": [560, 40, "start"], // Soria
  "44": [800, 220, "start"], // Teruel
  "28": [150, 330, "end"], // Madrid
  "08": [985, 40, "end"], // Barcelona
};

export const MapScene = () => {
  const frame = useCurrentFrame();
  const title = useEnter(0);
  const outline = interpolate(frame, [4, 30], [0, 1], clamp);
  const legend = useEnter(150);
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: "170px 90px 0" }}>
        <Kicker o={title}>CUÁNTO PESA TU VOTO</Kicker>
        <div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, color: V.text, marginTop: 20, opacity: title }}>
          Habitantes por cada diputado
        </div>
        <div style={{ fontFamily: FONT, fontSize: 34, color: V.dim, marginTop: 14, opacity: title }}>
          Media nacional: 1 diputado por cada {fmt(DATA.avgPerSeat)}
        </div>
        <svg width={spain.width} height={spain.height} viewBox={`0 0 ${spain.width} ${spain.height}`} style={{ marginTop: 40, overflow: "visible" }}>
          <rect x={spain.inset.x} y={spain.inset.y} width={spain.inset.w} height={spain.inset.h} rx={14} fill="none" stroke={V.line} strokeWidth={2} opacity={outline} />
          {spain.provinces.map((p) => {
            const d = byId[p.id];
            const t = interpolate(frame, [30 + order[p.id] * 2.4, 42 + order[p.id] * 2.4], [0, 1], clamp);
            return (
              <path key={p.id} d={p.d} fill={binOf(d.weight).color} fillOpacity={t} stroke={V.bg} strokeWidth={1.6} opacity={Math.max(outline * 0.35, t)} />
            );
          })}
          {spain.provinces
            .filter((p) => p.id in LABELS)
            .map((p) => (
              <MapLabel key={p.id} id={p.id} x={p.c[0]} y={p.c[1]} />
            ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 40, opacity: legend }}>
          {BINS.map((b) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT, fontSize: 34, color: V.text }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: b.color }} />
              {b.label}
            </div>
          ))}
        </div>
        <Source />
      </AbsoluteFill>
    </Scene>
  );
};

const MapLabel = ({ id, x, y }: { id: string; x: number; y: number }) => {
  const p = byId[id];
  const [lx, ly, anchor] = LABELS[id];
  const s = useEnter(30 + order[id] * 2.4 + 20);
  return (
    <g opacity={s}>
      <line x1={x} y1={y} x2={lx} y2={ly + 6} stroke={V.text} strokeWidth={2} />
      <circle cx={x} cy={y} r={7} fill={V.text} stroke={V.bg} strokeWidth={3} />
      <text x={lx} y={ly - 4} textAnchor={anchor} fill={V.text} fontSize={34} fontWeight={600} fontFamily={FONT} paintOrder="stroke" stroke={V.bg} strokeWidth={8}>
        {p.name}
      </text>
      <text x={lx} y={ly + 36} textAnchor={anchor} fill={V.text} fontSize={30} fontFamily={MONO} paintOrder="stroke" stroke={V.bg} strokeWidth={8}>
        {fmt(p.perSeat)}
      </text>
    </g>
  );
};

const RankList = ({ title, items, color, start, max }: { title: string; items: typeof DATA.provs; color: string; start: number; max: number }) => {
  const frame = useCurrentFrame();
  const h = useEnter(start);
  return (
    <div style={{ opacity: h }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 700, letterSpacing: -1.5, color: V.text }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
        {items.map((p, i) => {
          const g = interpolate(frame, [start + 8 + i * 6, start + 38 + i * 6], [0, 1], clamp);
          const e = 1 - Math.pow(1 - g, 3);
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "280px 1fr", alignItems: "center", gap: 24 }}>
              <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 600, color: V.text }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ height: 30, width: Math.max(6, 470 * (p.perSeat / max) * e), background: color, borderRadius: "0 6px 6px 0" }} />
                <div style={{ fontFamily: MONO, fontSize: 32, color: V.text, opacity: g }}>{fmt(p.perSeat * e)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Ranking = () => {
  const t = useEnter(0);
  const max = DATA.provs[DATA.provs.length - 1].perSeat;
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: "200px 90px 0" }}>
        <Kicker o={t}>HABITANTES POR DIPUTADO</Kicker>
        <div style={{ display: "flex", flexDirection: "column", gap: 90, marginTop: 70 }}>
          <RankList title="Donde más pesa tu voto" items={DATA.provs.slice(0, 5)} color={V.more2} start={10} max={max} />
          <RankList title="Donde menos pesa" items={DATA.provs.slice(-5).reverse()} color={V.less2} start={50} max={max} />
        </div>
        <Source />
      </AbsoluteFill>
    </Scene>
  );
};

export const Why = () => {
  const a = useEnter(4);
  const b = useEnter(34);
  const c = useEnter(70);
  return (
    <Scene>
      <AbsoluteFill style={{ background: V.bg, padding: PAD, justifyContent: "center" }}>
        <Kicker o={a}>¿POR QUÉ?</Kicker>
        <div style={{ fontFamily: DISPLAY, fontSize: 88, fontWeight: 700, lineHeight: 1.08, letterSpacing: -3, color: V.text, marginTop: 30, opacity: a, transform: up(a) }}>
          Cada provincia tiene 2 diputados fijos, tenga los habitantes que tenga.
        </div>
        <div style={{ fontFamily: FONT, fontSize: 50, lineHeight: 1.3, color: V.text, marginTop: 50, opacity: b, transform: up(b) }}>
          Los otros 248 se reparten según la población.
        </div>
        <div style={{ fontFamily: FONT, fontSize: 40, lineHeight: 1.35, color: V.dim, marginTop: 40, opacity: c }}>
          Por eso las provincias pequeñas tienen más diputados por habitante. Lo fija la ley electoral (LOREG, art. 162).
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

export const Outro = () => {
  const a = useEnter(4);
  const b = useEnter(24);
  return (
    <Scene fade={10}>
      <AbsoluteFill style={{ background: V.bg, padding: PAD, justifyContent: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 104, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3.5, color: V.text, opacity: a, transform: up(a) }}>
          ¿Cuánto pesa el voto en tu provincia?
        </div>
        <div style={{ fontFamily: FONT, fontSize: 46, color: V.dim, marginTop: 50, opacity: b }}>Dínoslo en los comentarios ↓</div>
        <div style={{ fontFamily: FONT, fontSize: 40, color: V.text, marginTop: 80, opacity: b }}>@tucuenta</div>
      </AbsoluteFill>
    </Scene>
  );
};

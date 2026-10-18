import { AbsoluteFill } from "remotion";
import { DISPLAY, FONT, MONO } from "../theme";
import { fmt } from "./fmt";
import { region, smallBlock } from "./insights";
import { V } from "./theme";

// Two validated categorical hues (dark mode) for side-by-side comparisons.
const A = "#3987E5";
const B = "#D95926";
export const HANDLE = "@tucuenta";
const SRC = "Fuente: INE, cifras oficiales del Padrón a 1-1-2025 · Escaños: Real Decreto de convocatoria del 29-N";

export const Frame = ({ children, kicker = "ELECCIONES 29-N · DATOS", src = SRC }: { children: React.ReactNode; kicker?: string; src?: string }) => (
  <AbsoluteFill style={{ background: V.bg, padding: "80px 80px 0", fontFamily: FONT, color: V.text }}>
    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: 6, color: V.dim }}>{kicker}</div>
    {children}
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
      <div style={{ fontSize: 21, lineHeight: 1.4, color: V.dim, maxWidth: 700 }}>{src}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: V.text, whiteSpace: "nowrap" }}>{HANDLE}</div>
    </div>
  </AbsoluteFill>
);

export const Headline = ({ children, size = 76 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ fontFamily: DISPLAY, fontSize: size, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2.5, marginTop: 28 }}>{children}</div>
);

export const Seats = ({ n, color, per = 10, size = 30 }: { n: number; color: string; per?: number; size?: number }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${per}, ${size}px)`, gap: 8 }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: "50%", background: color }} />
    ))}
  </div>
);

const Side = ({ color, title, pop, seats, note }: { color: string; title: string; pop: number; seats: number; note?: string }) => (
  <div style={{ flex: 1, background: V.panel, borderRadius: 24, padding: "34px 36px", borderTop: `8px solid ${color}` }}>
    <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
    {note && <div style={{ fontSize: 22, color: V.dim, marginTop: 10, lineHeight: 1.35 }}>{note}</div>}
    <div style={{ fontFamily: MONO, fontSize: 40, marginTop: 22 }}>{fmt(pop)}</div>
    <div style={{ fontSize: 24, color: V.dim }}>habitantes</div>
    <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, color: V.text, marginTop: 18, lineHeight: 1 }}>{seats}</div>
    <div style={{ fontSize: 24, color: V.dim, marginBottom: 22 }}>diputados</div>
    <Seats n={seats} color={color} per={8} size={26} />
  </div>
);

export const CardAlicante = () => {
  const b = smallBlock("03");
  return (
    <Frame>
      <Headline>
        {b.provs.length} provincias juntas tienen menos habitantes que Alicante.
        <span style={{ color: V.dim }}> Pero eligen {b.seats - b.target.seats} diputados más.</span>
      </Headline>
      <div style={{ display: "flex", gap: 28, marginTop: 50 }}>
        <Side color={A} title="Alicante" pop={b.target.pop} seats={b.target.seats} />
        <Side color={B} title={`Estas ${b.provs.length} juntas`} note={b.provs.map((p) => p.name).join(", ")} pop={b.pop} seats={b.seats} />
      </div>
    </Frame>
  );
};

export const CardValencia = () => {
  const b = smallBlock("46");
  return (
    <Frame>
      <Headline>
        {b.provs.length} provincias juntas tienen menos habitantes que Valencia.
        <span style={{ color: V.dim }}> Eligen {b.seats} diputados, como Madrid.</span>
      </Headline>
      <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
        <Side color={A} title="Provincia de Valencia" pop={b.target.pop} seats={b.target.seats} />
        <Side color={B} title={`Estas ${b.provs.length} juntas`} note={b.provs.map((p) => p.name).join(", ")} pop={b.pop} seats={b.seats} />
      </div>
    </Frame>
  );
};

export const CardRegiones = () => {
  const cyl = region("Castilla y León");
  const pv = region("País Vasco");
  return (
    <Frame>
      <Headline>
        Casi la misma población. <span style={{ color: V.dim }}>{cyl.seats - pv.seats} diputados de diferencia.</span>
      </Headline>
      <div style={{ display: "flex", gap: 28, marginTop: 50 }}>
        <Side color={A} title={cyl.name} note="9 provincias" pop={cyl.pop} seats={cyl.seats} />
        <Side color={B} title={pv.name} note="3 provincias" pop={pv.pop} seats={pv.seats} />
      </div>
      <div style={{ fontSize: 30, lineHeight: 1.4, color: V.text, marginTop: 40 }}>
        Cada provincia arranca con 2 diputados fijos: 9 provincias son 18 escaños antes de contar a nadie.
      </div>
    </Frame>
  );
};

export const Big = ({ value, unit, color }: { value: string; unit: string; color: string }) => (
  <div style={{ marginTop: 60 }}>
    <div style={{ fontFamily: DISPLAY, fontSize: 230, fontWeight: 700, letterSpacing: -9, lineHeight: 1, color }}>{value}</div>
    <div style={{ fontSize: 40, color: V.dim, marginTop: 10 }}>{unit}</div>
  </div>
);

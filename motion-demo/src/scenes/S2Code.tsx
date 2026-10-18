import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { C, DISPLAY, FONT, MONO } from "../theme";

const CODE = [
  "const frame = useCurrentFrame();",
  "",
  "const x = interpolate(",
  "  frame, [0, 90], [0, 520]",
  ");",
  "",
  "return <Card x={x} />;",
];
const CHARS_PER_FRAME = 2.4;

export const S2Code = () => {
  const frame = useCurrentFrame();
  const panel = useEnter(4);
  const typed = Math.max(0, (frame - 10) * CHARS_PER_FRAME);

  let budget = typed;
  const lines = CODE.map((l) => {
    const shown = l.slice(0, Math.max(0, Math.min(l.length, budget)));
    budget -= l.length + 1;
    return shown;
  });

  // The card on the right is driven by exactly the code on the left.
  const local = Math.max(0, frame - 30);
  const x = interpolate(local, [0, 90], [0, 520], { extrapolateRight: "clamp" });

  return (
    <Scene>
      <AbsoluteFill style={{ padding: "0 120px", justifyContent: "center", fontFamily: FONT }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 600, color: C.text, letterSpacing: -1.5 }}>
          Cada fotograma sale de una función del tiempo.
        </div>
        <div style={{ display: "flex", gap: 60, marginTop: 70, opacity: panel }}>
          <div
            style={{
              width: 820,
              height: 520,
              background: C.panel,
              border: `2px solid ${C.line}`,
              borderRadius: 24,
              padding: "48px 52px",
              fontFamily: MONO,
              fontSize: 34,
              lineHeight: 1.6,
              color: C.text,
              boxSizing: "border-box",
            }}
          >
            {lines.map((l, i) => (
              <div key={i} style={{ whiteSpace: "pre", minHeight: "1.6em" }}>
                <span style={{ color: l.includes("frame") ? C.accent : C.text }}>{l}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              flex: 1,
              height: 520,
              border: `2px dashed ${C.line}`,
              borderRadius: 24,
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 40 + x,
                top: 170,
                width: 160,
                height: 160,
                borderRadius: 28,
                background: C.accent,
              }}
            />
            <div
              style={{ position: "absolute", left: 40, bottom: 36, fontFamily: MONO, fontSize: 30, color: C.dim }}
            >
              frame = <span style={{ color: C.text }}>{String(local).padStart(3, "0")}</span>
              {"   "}x = <span style={{ color: C.text }}>{Math.round(x)}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

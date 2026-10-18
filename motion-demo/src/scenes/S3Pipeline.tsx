import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { C, DISPLAY, FONT, MONO } from "../theme";

const DEPTS = [
  { name: "Director", out: "BRIEF.md" },
  { name: "Arte", out: "STYLE.md" },
  { name: "Animación", out: "src/*.tsx" },
  { name: "Render", out: "demo.mp4" },
  { name: "Crítico", out: "findings.md" },
];
const START = 20;
const STEP = 18;
const NODE = 260;
const GAP = 70;

export const S3Pipeline = () => {
  const frame = useCurrentFrame();
  const title = useEnter(0);
  const total = DEPTS.length * NODE + (DEPTS.length - 1) * GAP;
  const lineProgress = interpolate(frame, [START, START + STEP * (DEPTS.length - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const loop = useEnter(START + STEP * DEPTS.length + 6);

  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, fontFamily: FONT }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 72,
            fontWeight: 600,
            color: C.text,
            letterSpacing: -2,
            opacity: title,
          }}
        >
          Un agente. <span style={{ color: C.accent }}>Cinco departamentos.</span>
        </div>
        <div style={{ position: "relative", width: total, height: 420, marginTop: 120 }}>
          <div
            style={{
              position: "absolute",
              top: NODE / 2,
              left: NODE / 2,
              height: 4,
              width: (total - NODE) * lineProgress,
              background: C.accent,
            }}
          />
          {DEPTS.map((d, i) => {
            const on = interpolate(frame, [START + i * STEP, START + i * STEP + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={d.name}
                style={{
                  position: "absolute",
                  left: i * (NODE + GAP),
                  width: NODE,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: NODE,
                    height: NODE,
                    borderRadius: 32,
                    background: on > 0.5 ? C.accent : C.panel,
                    border: `3px solid ${on > 0 ? C.accent : C.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${interpolate(on, [0, 1], [0.92, 1])})`,
                    fontFamily: DISPLAY,
                    fontSize: 44,
                    fontWeight: 600,
                    color: on > 0.5 ? C.bg : C.dim,
                  }}
                >
                  {d.name}
                </div>
                <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 28, color: C.dim, opacity: on }}>
                  {d.out}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 36, color: C.text, opacity: loop, marginTop: -20 }}>
          Si el crítico encuentra un fallo, se corrige ese fotograma y se vuelve a renderizar.
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

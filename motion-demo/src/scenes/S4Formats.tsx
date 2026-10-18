import { AbsoluteFill, interpolate } from "remotion";
import { Scene, useEnter } from "../Scene";
import { C, DISPLAY, FONT, MONO } from "../theme";

const FORMATS = [
  { label: "16:9", w: 560, h: 315, vertical: false },
  { label: "1:1", w: 400, h: 400, vertical: false },
  { label: "9:16", w: 270, h: 480, vertical: true },
];

// Same content, recomposed per format instead of cropped.
const Mini = ({ vertical }: { vertical: boolean }) => (
  <div
    style={{
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      gap: 18,
      padding: 26,
      height: "100%",
      boxSizing: "border-box",
      alignItems: vertical ? "stretch" : "center",
    }}
  >
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ height: 22, width: "90%", background: C.text, borderRadius: 6 }} />
      <div style={{ height: 22, width: "60%", background: C.text, borderRadius: 6 }} />
      <div style={{ height: 14, width: "70%", background: C.dim, borderRadius: 6, marginTop: 8 }} />
    </div>
    <div style={{ flex: 1, minHeight: 120, background: C.accent, borderRadius: 18 }} />
  </div>
);

export const S4Formats = () => {
  const title = useEnter(0);
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, fontFamily: FONT }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 600, color: C.text, letterSpacing: -2, opacity: title }}>
          Una historia, <span style={{ color: C.accent }}>tres formatos.</span>
        </div>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-end", marginTop: 110, height: 540 }}>
          {FORMATS.map((f, i) => (
            <FormatCard key={f.label} index={i} {...f} />
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

const FormatCard = ({ index, label, w, h, vertical }: (typeof FORMATS)[number] & { index: number }) => {
  const p = useEnter(10 + index * 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: p }}>
      <div
        style={{
          width: w,
          height: h,
          background: C.panel,
          border: `2px solid ${C.line}`,
          borderRadius: 20,
          overflow: "hidden",
          transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
        }}
      >
        <Mini vertical={vertical} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim }}>{label}</div>
    </div>
  );
};

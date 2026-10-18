import { AbsoluteFill, interpolate } from "remotion";
import { Scene, useEnter } from "../Scene";
import { C, DISPLAY, FONT, MONO } from "../theme";

export const S5Close = ({ totalFrames }: { totalFrames: number }) => {
  const a = useEnter(6);
  const b = useEnter(30);
  return (
    <Scene fade={10}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT, gap: 56 }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 96,
            fontWeight: 600,
            color: C.text,
            letterSpacing: -3,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: a,
            transform: `translateY(${interpolate(a, [0, 1], [30, 0])}px)`,
          }}
        >
          Escrito, renderizado y revisado
          <br />
          <span style={{ color: C.accent }}>por un agente.</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 32, color: C.dim, opacity: b }}>
          {totalFrames} fotogramas · 0 clics en un editor de vídeo
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

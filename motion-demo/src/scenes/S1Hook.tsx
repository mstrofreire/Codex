import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { C, DISPLAY } from "../theme";

export const S1Hook = () => {
  const frame = useCurrentFrame();
  const a = useEnter(8);
  const b = useEnter(46);
  const strike = interpolate(frame, [36, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: DISPLAY, gap: 24 }}>
        <div
          style={{
            position: "relative",
            fontSize: 120,
            fontWeight: 600,
            color: C.text,
            opacity: a * interpolate(strike, [0, 1], [1, 0.4]),
            transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
            letterSpacing: -3,
          }}
        >
          Esto no es un vídeo.
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "54%",
              height: 8,
              width: `${strike * 100}%`,
              background: C.accent,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 700,
            color: C.accent,
            opacity: b,
            transform: `translateY(${interpolate(b, [0, 1], [40, 0])}px)`,
            letterSpacing: -4,
          }}
        >
          Es código.
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

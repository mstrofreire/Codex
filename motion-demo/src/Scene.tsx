import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";

// Fades a scene in and out over `fade` frames at both ends of its Sequence.
export const Scene = ({ children, fade = 12 }: { children: React.ReactNode; fade?: number }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: C.bg, opacity }}>{children}</AbsoluteFill>;
};

// 0 → 1 settle with no overshoot, starting at `start`.
export const useEnter = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping: 200 } });
};

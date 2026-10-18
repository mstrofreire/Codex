import { AbsoluteFill, Sequence } from "remotion";
import { Duel, Hook, MapScene, Outro, Ranking, Why } from "./scenes";
import { V } from "./theme";

const SCENES = [
  { C: Hook, len: 90 },
  { C: Duel, len: 190 },
  { C: MapScene, len: 270 },
  { C: Ranking, len: 180 },
  { C: Why, len: 150 },
  { C: Outro, len: 90 },
];
export const VOTO_DURATION = SCENES.reduce((n, s) => n + s.len, 0);

export const VotoReel = () => {
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

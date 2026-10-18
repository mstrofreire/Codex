import { AbsoluteFill, Sequence } from "remotion";
import { S1Hook } from "./scenes/S1Hook";
import { S2Code } from "./scenes/S2Code";
import { S3Pipeline } from "./scenes/S3Pipeline";
import { S4Formats } from "./scenes/S4Formats";
import { S5Close } from "./scenes/S5Close";
import { C } from "./theme";

const SCENES = [
  { C: S1Hook, len: 90 },
  { C: S2Code, len: 150 },
  { C: S3Pipeline, len: 165 },
  { C: S4Formats, len: 105 },
];
const CLOSE = 90;
export const DURATION = SCENES.reduce((n, s) => n + s.len, 0) + CLOSE;

export const Demo = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {SCENES.map(({ C: Comp, len }, i) => {
        const seq = (
          <Sequence key={i} from={from} durationInFrames={len}>
            <Comp />
          </Sequence>
        );
        from += len;
        return seq;
      })}
      <Sequence from={from} durationInFrames={CLOSE}>
        <S5Close totalFrames={DURATION} />
      </Sequence>
    </AbsoluteFill>
  );
};

import { Composition, registerRoot } from "remotion";
import { createElement } from "react";
import { VotoReel, VOTO_DURATION } from "./VotoReel";

registerRoot(() =>
  createElement(Composition, { id: "Voto", component: VotoReel, durationInFrames: VOTO_DURATION, fps: 30, width: 1080, height: 1920 }),
);

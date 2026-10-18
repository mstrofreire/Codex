import { Composition, Still, registerRoot } from "remotion";
import { createElement, Fragment } from "react";
import { VotoReel, VOTO_DURATION } from "./VotoReel";
import { CardAlicante, CardRegiones, CardSoria, CardUltimo, CardValencia } from "./cards";

const card = { width: 1080, height: 1350 };
const CARDS = { Alicante: CardAlicante, Valencia: CardValencia, Regiones: CardRegiones, Ultimo: CardUltimo, Soria: CardSoria };

registerRoot(() =>
  createElement(
    Fragment,
    null,
    createElement(Composition, { id: "Voto", component: VotoReel, durationInFrames: VOTO_DURATION, fps: 30, width: 1080, height: 1920 }),
    ...Object.entries(CARDS).map(([id, component]) => createElement(Still, { key: id, id: `Card-${id}`, component, ...card })),
  ),
);

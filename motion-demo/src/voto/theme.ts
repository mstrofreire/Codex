// Neutral, non-partisan palette. Data colors: diverging blue (more weight) ↔ red (less).
export const V = {
  bg: "#111418",
  panel: "#1A1E24",
  line: "#2B3038",
  text: "#F0EFEC",
  dim: "#A9A89F",
  more2: "#6DA7EC",
  more1: "#3270BD",
  mid: "#3A3A37",
  less1: "#B34D4D",
  less2: "#E66767",
};

export const BINS = [
  { min: 2, color: V.more2, label: "Pesa el doble o más" },
  { min: 1.2, color: V.more1, label: "Pesa más que la media" },
  { min: 0.9, color: V.mid, label: "En torno a la media" },
  { min: 0.8, color: V.less1, label: "Pesa menos" },
  { min: 0, color: V.less2, label: "Pesa bastante menos" },
];
export const binOf = (w: number) => BINS.find((b) => w >= b.min)!;

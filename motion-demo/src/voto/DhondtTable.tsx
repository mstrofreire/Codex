// D'Hondt quotient table for one constituency: winners light up in seat order.
import { interpolate } from "remotion";
import circs from "./congreso2023/circunscripciones.json";
import grupos from "./congreso2023/grupos.json";
import { FONT, MONO } from "../theme";
import { fmt } from "./fmt";
import { V } from "./theme";

const SHORT: Record<string, string> = { "JxCAT - JUNTS": "Junts", "SUMAR - ECP": "Sumar" };
const G = grupos as unknown as Record<string, { color: string }>;

export type Cell = { party: number; div: number; q: number; rank: number };

export const dhondt = (code: string, rows = 5, cols = 3) => {
  const c = circs.circunscripciones.find((x) => x.codigoINE === code)!;
  const valid = c.votosCandidaturas + c.votosBlanco;
  const parties = c.candidaturas
    .filter((p) => p.votos * 100 >= 3 * valid)
    .sort((x, y) => y.votos - x.votos)
    .slice(0, rows)
    .map((p) => ({ name: SHORT[p.siglas] ?? p.siglas, votes: p.votos, color: G[p.cabeceraNacional]?.color ?? V.dim }));
  const cells: Cell[] = parties.flatMap((p, i) => Array.from({ length: cols }, (_, d) => ({ party: i, div: d + 1, q: p.votes / (d + 1), rank: 0 })));
  [...cells].sort((x, y) => y.q - x.q).forEach((cell, i) => (cell.rank = i + 1));
  return { seats: c.escanos, parties, cells, cols };
};

// Integer quotients as-is; fractional ones to one decimal (e.g. 31.625,5 · 31.149,3).
export const qfmt = (q: number) => {
  if (Number.isInteger(q)) return fmt(q);
  const [i, d] = q.toFixed(1).split(".");
  return `${fmt(Number(i))},${d}`;
};

// `lit(rank)` returns 0..1: how far that seat's highlight has progressed.
export const DhondtTable = ({ code, lit, scale = 1 }: { code: string; lit: (rank: number) => number; scale?: number }) => {
  const { seats, parties, cells, cols } = dhondt(code);
  const s = (n: number) => n * scale;
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: `${s(190)}px repeat(${cols}, 1fr)`, gap: s(10), alignItems: "center" }}>
        <div />
        {Array.from({ length: cols }, (_, d) => (
          <div key={d} style={{ fontSize: s(28), color: V.dim, textAlign: "center" }}>
            ÷ {d + 1}
          </div>
        ))}
        {parties.map((p, i) => (
          <Row key={p.name} name={p.name} color={p.color} cells={cells.filter((c) => c.party === i)} seats={seats} lit={lit} s={s} />
        ))}
      </div>
    </div>
  );
};

const Row = ({ name, color, cells, seats, lit, s }: { name: string; color: string; cells: Cell[]; seats: number; lit: (r: number) => number; s: (n: number) => number }) => (
  <>
    <div style={{ fontSize: s(34), fontWeight: 700, display: "flex", alignItems: "center", gap: s(12) }}>
      <span style={{ width: s(18), height: s(18), borderRadius: s(4), background: color }} />
      {name}
    </div>
    {cells.map((c) => {
      const t = lit(c.rank);
      const win = c.rank <= seats;
      const next = c.rank === seats + 1;
      return (
        <div
          key={c.div}
          style={{
            position: "relative",
            borderRadius: s(14),
            padding: `${s(16)}px ${s(10)}px`,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: s(30),
            background: win ? `rgba(109,167,236,${0.9 * t})` : V.panel,
            color: win && t > 0.5 ? V.bg : t > 0.5 && next ? V.text : V.dim,
            border: next ? `${s(3)}px dashed rgba(230,103,103,${t})` : `${s(3)}px solid transparent`,
          }}
        >
          {qfmt(c.q)}
          {(win || next) && (
            <span
              style={{
                position: "absolute",
                top: s(-14),
                right: s(-8),
                fontFamily: FONT,
                fontSize: s(20),
                fontWeight: 700,
                padding: `${s(2)}px ${s(8)}px`,
                borderRadius: s(8),
                background: next ? "#E66767" : V.text,
                color: V.bg,
                opacity: interpolate(t, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              {next ? `${seats + 1}.º fuera` : `${c.rank}.º`}
            </span>
          )}
        </div>
      );
    })}
  </>
);

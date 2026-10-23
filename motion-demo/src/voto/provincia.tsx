// Provincial kit: four cards for any of the 52 constituencies (props: INE code + brand handle).
// Every number comes from congreso2023/provincias.json (official data, computed by provincias.py).
import { Composition, Sequence, Still, interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../Scene";
import { DISPLAY, FONT, MONO } from "../theme";
import P from "./congreso2023/provincias.json";
import { Frame, Headline, HANDLE, SRC, Seats } from "./cards";
import { Note, SRC23, pct } from "./cards2";
import { qfmt } from "./DhondtTable";
import { fmt } from "./fmt";
import { V } from "./theme";

export type Partido = {
  codigo: string; siglas: string; nombre: string; art: string; color: string | null;
  votos: number; pct: number; escanos: number; faltan: number | null; quitaria: string | null;
};
type Cociente = { votos: number; divisor: number; cociente: number };
export type Prov = {
  code: string; slug: string; nombre: string; nombreOficial: string;
  escanos2026: number; escanos2023: number; mayoritaria: boolean;
  poblacion: number; habPorEscano: number; peso: number; rankPeso: number; rankMas: number; difMedia: number;
  censo: number; votantes: number; participacion: number; validos: number; blanco: number; pctSinEscano: number;
  partidos: Partido[];
  ajustado: {
    gana: string; pierde: string; votos: number; barrera: boolean;
    duelo: { pierde: Cociente; gana: Cociente; ultimoEscano: boolean } | null;
    umbral: { conVotos: number; pierde: Cociente } | null;
  };
  reparto2026: { partido: string; antes: number; despues: number }[];
};
export const PROVS = P.provincias as unknown as Record<string, Prov>;
export const MEDIA = P.mediaHabPorEscano;
export type KitProps = { code: string; marca?: string };

const ACCENT = V.more2;
const party = (p: Prov, nombre: string) => p.partidos.find((x) => x.nombre === nombre)!;
// "a" + "el PP" -> "al PP"; "de" + "el PP" -> "del PP"; "la CUP"/"Vox" keep their form.
const con = (prep: "a" | "de", x: Partido) => (x.art === "el" ? `${prep}l ${x.nombre}` : `${prep} ${x.art ? x.art + " " : ""}${x.nombre}`);
const art = (x: Partido) => (x.art ? `${x.art} ${x.nombre}` : x.nombre);
const dip = (n: number) => `${n} ${n === 1 ? "diputado" : "diputados"}`;
const esc = (n: number) => `${n} ${n === 1 ? "escaño" : "escaños"}`;
const color = (x: Partido) => x.color ?? V.dim;
const kicker = (p: Prov, when: string) => `${p.nombre.toUpperCase()} · ${when}`;
const src23 = (p: Prov) =>
  p.mayoritaria ? "Fuente: Ministerio del Interior, resultados oficiales del Congreso (23-J 2023). Escaño único: gana la lista más votada." : SRC23;
const en29N = (p: Prov) => (p.escanos2026 === 1 ? `El 29-N se elige 1 diputado en ${p.nombre}.` : `El 29-N se reparten ${p.escanos2026} escaños en ${p.nombre}.`);

const Name = ({ x, size = 32 }: { x: Partido; size?: number }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: size, fontWeight: 700 }}>
    <span style={{ width: size * 0.56, height: size * 0.56, borderRadius: 4, background: color(x) }} />
    {x.nombre}
  </span>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ flex: 1, background: V.panel, borderRadius: 22, padding: "28px 32px" }}>
    <div style={{ fontFamily: MONO, fontSize: 52, color: V.text }}>{value}</div>
    <div style={{ fontSize: 26, color: V.dim, marginTop: 8, lineHeight: 1.3 }}>{label}</div>
  </div>
);

// The 52 constituencies by inhabitants per seat, this one highlighted, with the national average.
const LADDER = Object.values(PROVS).sort((a, b) => a.habPorEscano - b.habPorEscano);
const Ladder = ({ p }: { p: Prov }) => {
  const H = 230;
  const w = (920 - 51 * 4) / 52;
  const max = LADDER[51].habPorEscano;
  const i = LADDER.findIndex((x) => x.code === p.code);
  const x = i * (w + 4) + w / 2;
  const half = (16 * p.nombre.length + 130) / 2; // rough label width at 28px
  const align = x - half < 0 ? "0%" : x + half > 920 ? "-100%" : "-50%";
  const avg = 50 + H - (H * MEDIA) / max;
  return (
    <div style={{ position: "relative", height: H + 120, marginTop: 64 }}>
      <div style={{ position: "absolute", left: x, top: 0, transform: `translateX(${align})`, whiteSpace: "nowrap", fontSize: 28, fontWeight: 700 }}>
        {p.nombre} <span style={{ fontFamily: MONO, fontWeight: 400, color: ACCENT }}>{fmt(p.habPorEscano)}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, height: H, display: "flex", alignItems: "flex-end", gap: 4 }}>
        {LADDER.map((q) => (
          <div key={q.code} style={{ width: w, height: (H * q.habPorEscano) / max, background: q.code === p.code ? ACCENT : V.line, borderRadius: "3px 3px 0 0" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: avg, borderTop: `2px dashed ${V.dim}` }} />
      <div style={{ position: "absolute", left: 0, top: avg - 34, fontSize: 22, color: V.dim }}>media de España: {fmt(MEDIA)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50 + H + 14, display: "flex", justifyContent: "space-between", fontSize: 22, color: V.dim }}>
        <span>← menos habitantes por diputado</span>
        <span>más →</span>
      </div>
    </div>
  );
};

// 1 · How many seats the province elects on 29-N, and how many people each one represents
export const ProvEscanos = ({ code, marca = HANDLE }: KitProps) => {
  const p = PROVS[code];
  const d = p.escanos2026 - p.escanos2023;
  const per = p.escanos2026 <= 12 ? p.escanos2026 : Math.ceil(p.escanos2026 / 2);
  const size = Math.min(70, Math.floor(920 / per) - 10);
  const quien = `${p.escanos2026 === 1 ? "El" : "Cada"} diputado de ${p.nombre}`;
  const vsMedia =
    Math.abs(p.difMedia) <= 1
      ? `${quien} representa prácticamente a la media de habitantes de España.`
      : `${quien} representa a un ${Math.abs(p.difMedia)} % ${p.difMedia < 0 ? "menos" : "más"} de habitantes que la media.`;
  const rank = p.rankPeso <= 26 ? `Es la ${p.rankPeso}.ª de 52 con menos habitantes por diputado.` : `Es la ${p.rankMas}.ª de 52 con más habitantes por diputado.`;
  return (
    <Frame kicker={kicker(p, "29-N")} src={SRC} brand={marca}>
      <Headline>
        {p.nombre} elige <span style={{ color: ACCENT }}>{dip(p.escanos2026)}</span> el 29-N.
        {d !== 0 && <span style={{ color: V.dim }}> {Math.abs(d) === 1 ? (d > 0 ? "Uno más" : "Uno menos") : `${Math.abs(d)} ${d > 0 ? "más" : "menos"}`} que en 2023.</span>}
      </Headline>
      <div style={{ marginTop: 56 }}>
        <Seats n={p.escanos2026} color={ACCENT} per={per} size={size} />
      </div>
      <Ladder p={p} />
      <Note>
        <span style={{ color: V.text }}>{vsMedia}</span> {rank}
      </Note>
    </Frame>
  );
};

const nth = (n: number) => (n === 1 ? "primer" : `${n}.º`);
// Votes per seat if the party takes this seat (the D'Hondt quotient); whole votes unless rounding would hide the gap.
const porEscano = (q: number, other: number) => (Math.round(q) === Math.round(other) ? qfmt(q) : fmt(q));

const DueloRow = ({ x, q, other, tag, win }: { x: Partido; q: Cociente; other: number; tag: string; win: boolean }) => (
  <div style={{ background: V.panel, borderRadius: 20, padding: "18px 28px", border: win ? `3px solid ${ACCENT}` : "3px dashed #E66767" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>
        <Name x={x} size={36} />
        <span style={{ fontSize: 26, color: V.dim, marginLeft: 14 }}>a por su {nth(q.divisor)} escaño</span>
      </span>
      <span style={{ fontSize: 24, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: win ? V.text : "#E66767", color: V.bg }}>{tag}</span>
    </div>
    <div style={{ fontSize: 28, color: V.dim, marginTop: 10 }}>
      {fmt(q.votos)} votos ÷ {q.divisor} {q.divisor === 1 ? "escaño" : "escaños"} =
    </div>
    <div style={{ fontFamily: MONO, fontSize: 42, marginTop: 4, color: win ? ACCENT : V.text }}>
      {porEscano(q.cociente, other)} <span style={{ fontFamily: FONT, fontSize: 28, color: V.dim }}>votos por escaño</span>
    </div>
  </div>
);

// The body of the closest-seat card: D'Hondt duel, 3 % barrier or plurality seat.
const AjustadoDetalle = ({ p }: { p: Prov }) => {
  const a = p.ajustado;
  const g = party(p, a.gana);
  const l = party(p, a.pierde);
  const top = [...p.partidos].sort((x, y) => y.votos - x.votos).slice(0, 4);
  return (
    <>
      {a.duelo && (
        <>
          <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 34 }}>
            Con la ley D'Hondt, cada escaño va al partido que, al sumarlo, sale a <b>más votos por escaño</b>.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 34 }}>
            <DueloRow x={l} q={a.duelo.pierde} other={a.duelo.gana.cociente} tag={`se llevó el último (${p.escanos2023}.º)`} win />
            <DueloRow x={g} q={a.duelo.gana} other={a.duelo.pierde.cociente} tag="se quedó fuera" win={false} />
          </div>
          <Note>
            Con {fmt(a.votos)} votos más, <span style={{ color: V.text }}>{art(g)}</span> habría salido a más votos por escaño que {art(l)} y se lo habría llevado.
          </Note>
        </>
      )}
      {a.barrera && (
        <>
          <div style={{ position: "relative", height: 150, marginTop: 80 }}>
            <div style={{ position: "absolute", top: 30, height: 50, width: 920 * (g.pct / 4), background: color(g), borderRadius: "0 8px 8px 0" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 920 * (3 / 4), borderLeft: `4px dashed ${V.text}` }} />
            <div style={{ position: "absolute", top: -44, right: 920 / 4 - 10, fontSize: 26, color: V.text, whiteSpace: "nowrap" }}>Barrera: 3 % de los votos válidos</div>
            <div style={{ position: "absolute", top: 98, left: 0, fontFamily: MONO, fontSize: 32 }}>
              {g.nombre}: {pct(g.pct)} · {fmt(g.votos)} votos
            </div>
          </div>
          {a.umbral && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
              <DueloRow x={l} q={a.umbral.pierde} other={a.umbral.conVotos} tag={`se llevó el último (${p.escanos2023}.º)`} win />
              <DueloRow x={g} q={{ votos: a.umbral.conVotos, divisor: 1, cociente: a.umbral.conVotos }} other={a.umbral.pierde.cociente} tag={`con ${fmt(a.votos)} votos más`} win={false} />
            </div>
          )}
        </>
      )}
      {p.mayoritaria && (
        <>
          <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 34 }}>{p.nombre} elige un solo diputado: se lo lleva la candidatura más votada.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 50 }}>
            {top.map((x) => (
              <div key={x.codigo}>
                <Name x={x} size={36} />
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
                  <div style={{ height: 44, width: 700 * (x.votos / top[0].votos), background: color(x), borderRadius: "0 8px 8px 0" }} />
                  <span style={{ fontFamily: MONO, fontSize: 36 }}>{fmt(x.votos)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

// 2 · The cheapest seat to flip in 2023 (D'Hondt duel, 3 % barrier or plurality seat)
export const ProvAjustado = ({ code, marca = HANDLE }: KitProps) => {
  const p = PROVS[code];
  const a = p.ajustado;
  const g = party(p, a.gana);
  const l = party(p, a.pierde);
  return (
    <Frame kicker={kicker(p, "23-J 2023")} src={src23(p)} brand={marca}>
      <Headline size={70}>
        En {p.nombre}, {con("a", g)} le faltaron <span style={{ color: ACCENT }}>{fmt(a.votos)} votos</span> para {a.barrera ? "superar el 3 % y " : ""}quitarle{" "}
        {p.mayoritaria ? "el" : "un"} diputado {con("a", l)}.
      </Headline>
      <AjustadoDetalle p={p} />
      <Note>{en29N(p)}</Note>
    </Frame>
  );
};

// 3 · New votes each party needed for one more seat
export const ProvFaltan = ({ code, marca = HANDLE }: KitProps) => {
  const p = PROVS[code];
  const rows = p.partidos.filter((x) => x.faltan !== null).sort((x, y) => x.faltan! - y.faltan!).slice(0, 5);
  return (
    <Frame kicker={kicker(p, "23-J 2023")} src={src23(p)} brand={marca}>
      <Headline size={66}>¿Cuántos votos le faltaron a cada partido para {p.mayoritaria ? "ganar el escaño" : "un diputado más"}?</Headline>
      <div style={{ fontSize: 28, color: V.dim, marginTop: 18 }}>Votos nuevos en {p.nombre}, sin quitárselos a nadie, y a quién le habría quitado el escaño</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40 }}>
        {rows.map((x) => (
          <div key={x.codigo} style={{ display: "grid", gridTemplateColumns: "1fr 170px 230px", alignItems: "center", background: V.panel, borderRadius: 18, padding: "20px 26px" }}>
            <div>
              <Name x={x} size={32} />
              <div style={{ fontSize: 22, color: V.dim, marginTop: 6 }}>a costa {con("de", party(p, x.quitaria!))}</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: V.dim, textAlign: "center" }}>
              {x.escanos} → {x.escanos + 1}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 38, textAlign: "right" }}>+{fmt(x.faltan!)}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// 4 · How the seats were shared in 2023, turnout and votes that elected nobody
export const ProvReparto = ({ code, marca = HANDLE }: KitProps) => {
  const p = PROVS[code];
  const winners = p.partidos.filter((x) => x.escanos > 0);
  const bars = p.partidos.filter((x) => x.escanos > 0 || x.pct >= 3).slice(0, 6);
  const max = bars[0].pct;
  return (
    <Frame kicker={kicker(p, "23-J 2023")} src={src23(p)} brand={marca}>
      <Headline size={70}>
        Así se {p.escanos2023 === 1 ? "decidió el escaño" : `repartieron los ${p.escanos2023} escaños`} de {p.nombre} en 2023
      </Headline>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 40, maxWidth: 920 }}>
        {winners.flatMap((x) => Array.from({ length: x.escanos }, (_, i) => <div key={`${x.codigo}-${i}`} style={{ width: 34, height: 34, borderRadius: "50%", background: color(x) }} />))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 40 }}>
        {bars.map((x) => (
          <div key={x.codigo} style={{ display: "grid", gridTemplateColumns: "250px 1fr 150px", alignItems: "center", gap: 16 }}>
            <Name x={x} size={30} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ height: 30, width: 330 * (x.pct / max), background: color(x), borderRadius: "0 6px 6px 0" }} />
              <span style={{ fontFamily: MONO, fontSize: 28 }}>{pct(x.pct)}</span>
            </div>
            <span style={{ fontSize: 26, color: x.escanos ? V.text : V.dim, textAlign: "right" }}>{esc(x.escanos)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 44 }}>
        <Stat value={pct(p.participacion)} label="participación" />
        <Stat value={pct(p.pctSinEscano)} label="de los votos válidos fue a partidos sin escaño" />
      </div>
    </Frame>
  );
};

// 5 · Closest seat as a 4:5 video (≈17 s): hook, the number, why (D'Hondt), what is at stake on 29-N.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const up = (v: number, d = 40) => ({ opacity: v, transform: `translateY(${interpolate(v, [0, 1], [d, 0])}px)` });
const V_HOOK = 80;
const V_NUM = 150;
const V_WHY = 210;
const V_END = 90;
export const AJUSTADO_VIDEO = V_HOOK + V_NUM + V_WHY + V_END;

const VHook = ({ p, marca }: { p: Prov; marca: string }) => {
  const a = useEnter(4);
  const b = useEnter(34);
  return (
    <Scene>
      <Frame kicker={kicker(p, "29-N")} src="" brand={marca}>
        <div style={{ fontFamily: DISPLAY, fontSize: 120, fontWeight: 700, lineHeight: 1, letterSpacing: -4, marginTop: 260, ...up(a, 50) }}>
          ¿Tu voto no cuenta en {p.nombre}?
        </div>
        <div style={{ fontSize: 46, color: V.dim, marginTop: 40, ...up(b) }}>Mira lo que pasó en 2023.</div>
      </Frame>
    </Scene>
  );
};

const VNumero = ({ p, marca }: { p: Prov; marca: string }) => {
  const frame = useCurrentFrame();
  const a = p.ajustado;
  const t = useEnter(0);
  const n = interpolate(frame, [14, 64], [0, a.votos], clamp);
  const end = useEnter(70);
  return (
    <Scene>
      <Frame kicker={kicker(p, "23-J 2023")} src={src23(p)} brand={marca}>
        <div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2.5, marginTop: 120, ...up(t) }}>
          En 2023, {con("a", party(p, a.gana))} le faltaron
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 250, fontWeight: 700, letterSpacing: -10, lineHeight: 1, color: ACCENT }}>{fmt(n)}</span>
          <span style={{ fontSize: 60, color: V.dim }}>votos</span>
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2.5, marginTop: 30, ...up(end) }}>
          para {a.barrera ? "superar el 3 % y " : ""}quitarle {p.mayoritaria ? "el" : "un"} diputado {con("a", party(p, a.pierde))}.
        </div>
      </Frame>
    </Scene>
  );
};

const VPorque = ({ p, marca }: { p: Prov; marca: string }) => {
  const t = useEnter(0);
  const d = useEnter(20);
  return (
    <Scene>
      <Frame kicker={kicker(p, "23-J 2023")} src={src23(p)} brand={marca}>
        <div style={{ fontFamily: DISPLAY, fontSize: 70, fontWeight: 700, letterSpacing: -2.5, marginTop: 28, ...up(t) }}>¿Cómo se decidió?</div>
        <div style={up(d, 60)}>
          <AjustadoDetalle p={p} />
        </div>
      </Frame>
    </Scene>
  );
};

const VFinal = ({ p, marca }: { p: Prov; marca: string }) => {
  const a = useEnter(4);
  const b = useEnter(30);
  return (
    <Scene>
      <Frame kicker={kicker(p, "29-N")} src={SRC} brand={marca}>
        <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, marginTop: 220, ...up(a, 50) }}>{en29N(p)}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, marginTop: 40, color: ACCENT, ...up(b, 50) }}>Cada voto cuenta.</div>
      </Frame>
    </Scene>
  );
};

export const ProvAjustadoVideo = ({ code, marca = HANDLE }: KitProps) => {
  const p = PROVS[code];
  const parts = [VHook, VNumero, VPorque, VFinal];
  const lens = [V_HOOK, V_NUM, V_WHY, V_END];
  return (
    <>
      {parts.map((C, i) => (
        <Sequence key={i} from={lens.slice(0, i).reduce((s, x) => s + x, 0)} durationInFrames={lens[i]}>
          <C p={p} marca={marca} />
        </Sequence>
      ))}
    </>
  );
};

export const KIT = { Escanos: ProvEscanos, Ajustado: ProvAjustado, Faltan: ProvFaltan, Reparto: ProvReparto };
// Render with --props='{"code":"17","marca":"@medio"}' (INE code; marca = handle shown in the corner).
export const KIT_STILLS = Object.entries(KIT).map(([id, component]) => (
  <Still key={id} id={`Prov-${id}`} component={component} defaultProps={{ code: "17" }} width={1080} height={1350} />
));
export const KIT_VIDEO = (
  <Composition id="Prov-AjustadoVideo" component={ProvAjustadoVideo} defaultProps={{ code: "17" }} durationInFrames={AJUSTADO_VIDEO} fps={30} width={1080} height={1350} />
);

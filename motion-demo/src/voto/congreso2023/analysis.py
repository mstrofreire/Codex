"""Findings over the official 2023 Congress results -> analysis.json"""
import json
from fractions import Fraction
from itertools import product
from dhondt import CIRC, allocate, head, HERE

G = json.loads((HERE / "grupos.json").read_text())
SIGLAS = {}
for _c in CIRC:
    for _p in _c["candidaturas"]:
        SIGLAS.setdefault(head(_p), _p["siglas"])
label = lambda code: G.get(code, {}).get("etiqueta", SIGLAS.get(code, code))
out = {}

# Party (national head) totals
tot_votes, tot_seats = {}, {}
for c in CIRC:
    for p in c["candidaturas"]:
        tot_votes[head(p)] = tot_votes.get(head(p), 0) + p["votos"]
        tot_seats[head(p)] = tot_seats.get(head(p), 0) + p["escanosOficiales"]
cand = sum(c["votosCandidaturas"] for c in CIRC)
blank = sum(c["votosBlanco"] for c in CIRC)
out["totales"] = {"votosCandidaturas": cand, "votosBlanco": blank}

# 1) Price of a seat per party (votes per seat, national)
out["precio"] = sorted(
    [{"partido": label(h), "votos": v, "escanos": tot_seats[h], "votosPorEscano": round(v / tot_seats[h])} for h, v in tot_votes.items() if tot_seats[h]],
    key=lambda r: -r["escanos"],
)

# 2) Pure national proportionality (single 350-seat D'Hondt, no threshold)
q = sorted(((Fraction(v, d), v, h) for h, v in tot_votes.items() for d in range(1, 351)), reverse=True)[:350]
prop = {}
for _, _, h in q:
    prop[h] = prop.get(h, 0) + 1
out["proporcional"] = sorted(
    [{"partido": label(h), "real": tot_seats.get(h, 0), "proporcional": prop.get(h, 0), "pct": round(tot_votes[h] / cand * 100, 2)} for h in set(prop) | {h for h in tot_seats if tot_seats[h]}],
    key=lambda r: -max(r["real"], r["proporcional"]),
)


# 3) Minimum NEW votes for a candidature to win one more seat in its constituency
def min_to_gain(c, code, target):
    lo, hi = 0, c["votosCandidaturas"] * 2
    if allocate(c, {code: hi})[code] < target:
        return None
    while lo < hi:
        m = (lo + hi) // 2
        if allocate(c, {code: m})[code] >= target:
            hi = m
        else:
            lo = m + 1
    return lo


flips = []
for c in CIRC:
    base = allocate(c)
    for p in c["candidaturas"]:
        n = min_to_gain(c, p["codigo"], base[p["codigo"]] + 1)
        if n is None:
            continue
        after = allocate(c, {p["codigo"]: n})
        loser = next(x for x in c["candidaturas"] if after[x["codigo"]] < base[x["codigo"]])
        flips.append({"circ": c["nombre"], "gana": label(head(p)), "pierde": label(head(loser)), "votos": n})
flips.sort(key=lambda f: f["votos"])
out["ajustados"] = flips[:15]
best = {}
for f in flips:
    best.setdefault(f["circ"], f)
out["ajustadoPorCirc"] = sorted(best.values(), key=lambda f: f["votos"])


# 4) Blocs: minimum new votes to reach 176 seats
def bloc_gain_costs(heads, maxg=4):
    """Per constituency: min new votes to raise the bloc's seats by g (g=1..maxg), via grid over bloc members."""
    res = []
    for c in CIRC:
        mem = [p for p in c["candidaturas"] if head(p) in heads]
        if not mem:
            continue
        base = allocate(c)
        b0 = sum(base[p["codigo"]] for p in mem)
        cands = {}
        for p in mem:
            pts = {0}
            for t in range(1, maxg + 1):
                n = min_to_gain(c, p["codigo"], base[p["codigo"]] + t)
                if n is not None:
                    pts.add(n)
            cands[p["codigo"]] = sorted(pts)
        best = {}
        for combo in product(*cands.values()):
            extra = dict(zip(cands.keys(), combo))
            a = allocate(c, extra)
            g = sum(a[p["codigo"]] for p in mem) - b0
            if g > 0:
                cost = sum(combo)
                for k in range(1, g + 1):
                    if k not in best or cost < best[k][0]:
                        best[k] = (cost, extra)
        res.append((c["nombre"], best))
    return res


def bloc(heads, name):
    seats = sum(tot_seats.get(h, 0) for h in heads)
    need = max(0, 176 - seats)
    costs = bloc_gain_costs(heads, maxg=min(need, 4) or 1)
    # knapsack over constituencies: min votes for `need` seats
    INF = float("inf")
    dp = [(0, [])] + [(INF, [])] * need
    for circ, best in costs:
        new = list(dp)
        for g, (cost, extra) in best.items():
            for s in range(need + 1):
                if dp[s][0] < INF:
                    t = min(need, s + g)
                    if dp[s][0] + cost < new[t][0]:
                        who = "+".join(f"{label(next(head(p) for c in CIRC if c['nombre'] == circ for p in c['candidaturas'] if p['codigo'] == k))} {v}" for k, v in extra.items() if v)
                        new[t] = (dp[s][0] + cost, dp[s][1] + [(circ, g, cost, who)])
        dp = new
    return {"bloque": name, "escanos": seats, "faltan": need, "votos": dp[need][0], "donde": dp[need][1]}


H = {label(h): h for h in tot_votes}
out["bloques"] = [
    bloc([H["PP"], H["VOX"]], "PP + Vox"),
    bloc([H["PSOE"], H["SUMAR"]], "PSOE + Sumar"),
]

# 5) Smallest share with which a seat was won, per constituency (non-majoritarian)
eff = []
for c in CIRC:
    if c["esMayoritaria"]:
        continue
    valid = c["votosCandidaturas"] + c["votosBlanco"]
    winners = [p for p in c["candidaturas"] if p["escanosOficiales"] > 0]
    w = min(winners, key=lambda p: p["votos"])
    losers = [p for p in c["candidaturas"] if p["escanosOficiales"] == 0]
    l = max(losers, key=lambda p: p["votos"]) if losers else None
    eff.append({"circ": c["nombre"], "escanos": c["escanos"], "minGanador": label(head(w)), "minPct": round(w["votos"] / valid * 100, 2),
                "maxPerdedor": label(head(l)) if l else None, "maxPerdedorPct": round(l["votos"] / valid * 100, 2) if l else None})
out["umbral"] = sorted(eff, key=lambda r: -r["maxPerdedorPct"])

# 6) 2026 seats with 2023 votes (Madrid 37->38, Cádiz 9->8)
chg = []
for code, seats in (("28", 38), ("11", 8)):
    c = next(x for x in CIRC if x["codigoINE"] == code)
    a0, a1 = allocate(c), allocate({**c, "escanos": seats})
    for p in c["candidaturas"]:
        if a0[p["codigo"]] != a1[p["codigo"]]:
            chg.append({"circ": c["nombre"], "partido": label(head(p)), "antes": a0[p["codigo"]], "despues": a1[p["codigo"]]})
out["reparto2026"] = chg

(HERE / "analysis.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
print(json.dumps({k: out[k] for k in ("precio", "proporcional", "bloques", "reparto2026")}, ensure_ascii=False, indent=0)[:4000])
print("AJUSTADOS:", *[f"{f['circ']}: {f['gana']} quita a {f['pierde']} con {f['votos']}" for f in out["ajustados"][:12]], sep="\n  ")
print("UMBRAL (mayor % sin escaño):", *[f"{r['circ']} {r['escanos']}: {r['maxPerdedor']} {r['maxPerdedorPct']}% sin escaño | escaño más barato {r['minGanador']} {r['minPct']}%" for r in out["umbral"][:6]], sep="\n  ")
print("UMBRAL bajo:", *[f"{r['circ']}: {r['minGanador']} {r['minPct']}%" for r in sorted(out['umbral'], key=lambda r: r['minPct'])[:4]], sep="\n  ")

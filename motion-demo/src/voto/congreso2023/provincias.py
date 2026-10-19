"""Per-constituency facts for the provincial kits -> provincias.json

Joins the official 2023 Congress results (Interior) with the 29-N 2026 seats and
INE population (../data.json). Every number a provincial card or post shows comes
from here, already rounded the way it is displayed.
"""
import json
from fractions import Fraction
from dhondt import CIRC, allocate, head, min_to_gain, HERE

G = json.loads((HERE / "grupos.json").read_text())
POB = json.loads((HERE.parent / "data.json").read_text())
PROV = {p["id"]: p for p in POB["provs"]}
RANK = {p["id"]: i + 1 for i, p in enumerate(POB["provs"])}  # 1 = fewest inhabitants per seat

# Short display names for local candidatures (siglas as filed are kept in "siglas").
NOMBRE = {
    "JxCAT - JUNTS": "Junts", "SUMAR - ECP": "Sumar", "SUMAR - COMPROMÍS": "Sumar", "SUMAR ARAGÓN": "Sumar",
    "MÉS PER MALLORCA-MÉS PER MENORCA-SUMAR": "Sumar", "SUMAR": "Sumar", "VOX": "Vox", "B.N.G.": "BNG",
    "PSE-EE (PSOE)": "PSE-EE", "PSIB-PSOE": "PSIB", "PSN-PSOE": "PSN", "PSdeG-PSOE": "PSdeG", "U.P.N.": "UPN",
    "U.P.L.": "UPL", "EXISTE": "Teruel Existe", "SY": "Soria ¡Ya!", "EAJ-PNV": "PNV", "CCa": "CC",
    "PDeCAT-E-CiU": "PDeCAT", "ADELANTE ANDALUCÍA": "Adelante Andalucía", "CUP-PR": "CUP", "NC-bc": "NC-BC",
}
ART = {n: "el" for n in ("PP", "PSOE", "PSC", "PSdeG", "PSE-EE", "PSIB", "PSN", "BNG", "PNV", "PDeCAT")} | {"CUP": "la"}
PROV_NOMBRE = {"38": "Santa Cruz de Tenerife"}
r1 = lambda x: round(float(x), 1)


def facts(c):
    code = c["codigoINE"]
    valid = c["votosCandidaturas"] + c["votosBlanco"]
    base = allocate(c)
    name = lambda p: NOMBRE.get(p["siglas"], p["siglas"])
    by_code = {p["codigo"]: p for p in c["candidaturas"]}

    partidos = []
    for p in sorted(c["candidaturas"], key=lambda p: -p["votos"]):
        if p["votos"] * 100 < valid and not base[p["codigo"]]:
            continue  # below 1 % and no seat: not shown anywhere
        n = min_to_gain(c, p["codigo"], base[p["codigo"]] + 1)
        loser = None
        if n is not None:
            after = allocate(c, {p["codigo"]: n})
            loser = next(name(x) for x in c["candidaturas"] if after[x["codigo"]] < base[x["codigo"]])
        partidos.append({
            "codigo": p["codigo"], "siglas": p["siglas"], "nombre": name(p), "art": ART.get(name(p), ""),
            "color": G.get(head(p), {}).get("color"), "votos": p["votos"], "pct": r1(p["votos"] * 100 / valid),
            "escanos": base[p["codigo"]], "faltan": n, "quitaria": loser,
        })

    # Cheapest seat to flip, with the two quotients that decided it.
    best = min((p for p in partidos if p["faltan"] is not None), key=lambda p: p["faltan"])
    g, l = by_code[best["codigo"]], next(by_code[p["codigo"]] for p in partidos if p["nombre"] == best["quitaria"])
    eligible = g["votos"] * 100 >= 3 * valid
    duelo = umbral = None
    if not eligible and not c["esMayoritaria"]:  # below the 3 % barrier: the last seat its new votes would have beaten
        dl = base[l["codigo"]]
        umbral = {"conVotos": g["votos"] + best["faltan"], "pierde": {"votos": l["votos"], "divisor": dl, "cociente": r1(Fraction(l["votos"], dl))}}
    if eligible and not c["esMayoritaria"]:
        dg, dl = base[g["codigo"]] + 1, base[l["codigo"]]
        ranked = sorted((Fraction(x["votos"], d) for x in c["candidaturas"] if x["votos"] * 100 >= 3 * valid for d in range(1, c["escanos"] + 2)), reverse=True)
        qg = Fraction(g["votos"], dg)
        duelo = {
            "pierde": {"votos": l["votos"], "divisor": dl, "cociente": r1(Fraction(l["votos"], dl))},
            "gana": {"votos": g["votos"], "divisor": dg, "cociente": r1(qg), "puesto": 1 + sum(q > qg for q in ranked)},
            "ultimoEscano": Fraction(l["votos"], dl) == ranked[c["escanos"] - 1],
        }
    ajustado = {"gana": best["nombre"], "pierde": best["quitaria"], "votos": best["faltan"], "barrera": not eligible, "duelo": duelo, "umbral": umbral}

    s26 = PROV[code]["seats"]
    cambio = []
    if s26 != c["escanos"]:
        a26 = allocate({**c, "escanos": s26})
        cambio = [{"partido": name(p), "antes": base[p["codigo"]], "despues": a26[p["codigo"]]} for p in c["candidaturas"] if a26[p["codigo"]] != base[p["codigo"]]]

    votantes = valid + c["votosNulos"]
    return {
        "code": code, "slug": c["slug"], "nombre": PROV_NOMBRE.get(code, PROV[code]["name"]), "nombreOficial": c["nombre"],
        "escanos2026": s26, "escanos2023": c["escanos"], "mayoritaria": c["esMayoritaria"],
        "poblacion": PROV[code]["pop"], "habPorEscano": PROV[code]["perSeat"], "peso": PROV[code]["weight"], "rankPeso": RANK[code],
        "rankMas": len(PROV) + 1 - RANK[code], "difMedia": round((PROV[code]["perSeat"] / POB["avgPerSeat"] - 1) * 100),
        "censo": c["censoEscrutinio"], "votantes": votantes, "participacion": r1(votantes * 100 / c["censoEscrutinio"]),
        "validos": valid, "blanco": c["votosBlanco"],
        "pctSinEscano": r1(sum(p["votos"] for p in c["candidaturas"] if not base[p["codigo"]]) * 100 / valid),
        "partidos": partidos, "ajustado": ajustado, "reparto2026": cambio,
    }


out = {
    "_nota": "Generado por provincias.py. Votos 2023: Ministerio del Interior (Infoelectoral). Escaños 2026: Real Decreto 806/2026. Población: INE, Padrón a 1-1-2025.",
    "mediaHabPorEscano": POB["avgPerSeat"],
    "provincias": {c["codigoINE"]: facts(c) for c in sorted(CIRC, key=lambda c: c["codigoINE"])},
}
(HERE / "provincias.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    P = out["provincias"]
    odd = [p["nombre"] for p in P.values() if p["ajustado"]["duelo"] and not p["ajustado"]["duelo"]["ultimoEscano"]]
    print(len(P), "provincias · duelos que no son el último escaño:", odd or "ninguno")
    for k in ("17", "42", "28", "11", "51"):
        p = P[k]
        print(f"{p['nombre']:<10} {p['escanos2026']} esc · {p['habPorEscano']} hab/esc (rank {p['rankPeso']}) · part. {p['participacion']} % · "
              f"sin escaño {p['pctSinEscano']} % · ajustado {p['ajustado']['gana']}→{p['ajustado']['pierde']} {p['ajustado']['votos']} · 2026 {p['reparto2026']}")

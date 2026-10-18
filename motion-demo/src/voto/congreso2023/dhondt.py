"""Exact D'Hondt for the Congress (LOREG art. 163) over the official 2023 results.

3 % threshold over valid votes (candidaturas + blanco), exact quotient comparison,
ties to the candidature with more votes. Ceuta and Melilla: one seat, plurality.
"""
import json
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).parent
CIRC = json.loads((HERE / "circunscripciones.json").read_text())["circunscripciones"]


def allocate(c, extra=None):
    """Seats per candidature code. `extra` = {code: added votes} (new votes, e.g. from abstention)."""
    extra = extra or {}
    votes = {p["codigo"]: p["votos"] + extra.get(p["codigo"], 0) for p in c["candidaturas"]}
    if c["esMayoritaria"]:
        w = max(votes, key=votes.get)
        return {k: int(k == w) for k in votes}
    valid = sum(votes.values()) + c["votosBlanco"]
    elig = [k for k, v in votes.items() if v * 100 >= 3 * valid]
    q = sorted(((Fraction(votes[k], d), votes[k], k) for k in elig for d in range(1, c["escanos"] + 1)), reverse=True)
    won = {k: 0 for k in votes}
    for _, _, k in q[: c["escanos"]]:
        won[k] += 1
    return won


def head(p):
    return p["cabeceraNacional"]


if __name__ == "__main__":
    bad = [c["nombre"] for c in CIRC if any(allocate(c)[p["codigo"]] != p["escanosOficiales"] for p in c["candidaturas"])]
    print("circunscripciones que no cuadran:", bad or "ninguna")

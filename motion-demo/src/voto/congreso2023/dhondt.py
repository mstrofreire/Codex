"""Exact D'Hondt for the Congress (LOREG art. 163) over the official 2023 results.

3 % threshold over valid votes (candidaturas + blanco), exact quotient comparison,
ties to the candidature with more votes (equal votes too: decided by lot, see `unlucky`).
Ceuta and Melilla: one seat, plurality.
"""
import json
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).parent
CIRC = json.loads((HERE / "circunscripciones.json").read_text())["circunscripciones"]


def allocate(c, extra=None, unlucky=None):
    """Seats per candidature code. `extra` = {code: added votes} (new votes, e.g. from abstention).

    `unlucky` = a candidature that loses every tie the law leaves to a draw.
    """
    extra = extra or {}
    votes = {p["codigo"]: p["votos"] + extra.get(p["codigo"], 0) for p in c["candidaturas"]}
    if c["esMayoritaria"]:
        w = max(votes, key=lambda k: (votes[k], k != unlucky))
        return {k: int(k == w) for k in votes}
    valid = sum(votes.values()) + c["votosBlanco"]
    elig = [k for k, v in votes.items() if v * 100 >= 3 * valid]
    q = sorted(((Fraction(votes[k], d), votes[k], k != unlucky, k) for k in elig for d in range(1, c["escanos"] + 1)), reverse=True)
    won = {k: 0 for k in votes}
    for *_, k in q[: c["escanos"]]:
        won[k] += 1
    return won


def head(p):
    return p["cabeceraNacional"]


def min_to_gain(c, code, target):
    """Minimum NEW votes for candidature `code` to reach `target` seats without needing a draw (None if unreachable)."""
    lo, hi = 0, c["votosCandidaturas"] * 2
    if allocate(c, {code: hi}, code)[code] < target:
        return None
    while lo < hi:
        m = (lo + hi) // 2
        if allocate(c, {code: m}, code)[code] >= target:
            hi = m
        else:
            lo = m + 1
    return lo


if __name__ == "__main__":
    bad = [c["nombre"] for c in CIRC if any(allocate(c)[p["codigo"]] != p["escanosOficiales"] for p in c["candidaturas"])]
    print("circunscripciones que no cuadran:", bad or "ninguna")

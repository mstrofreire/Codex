"""Descarga y valida las series diarias del universo de ETFs (tarea T01).

Para cada ETF descarga de Yahoo Finance el cierre ajustado (incluye dividendos y splits) y lo
valida contra una referencia independiente (un índice o un precio en otra divisa convertido a
euros). Un día es sospechoso si el ETF se mueve mucho y su referencia no:

    |rentabilidad ETF| > UMBRAL_MOVIMIENTO  y  |ETF - referencia| > UMBRAL_DIFERENCIA

Además comprueba precios no positivos, huecos largos y precios repetidos (serie congelada).

Correcciones, siempre registradas en el informe:
- Arranque defectuoso: si en el primer año hay un tramo de precios congelados (el mismo cierre
  REPETIDOS_MAXIMO días o más), la serie empieza cuando el precio vuelve a moverse. Es típico de
  los primeros meses de un ETF en Yahoo: el precio no se actualiza y después salta de golpe.
- Anomalía en el primer año (por ejemplo, un cambio de nivel permanente porque Yahoo empalma dos
  series distintas): la serie empieza en el último día sospechoso de ese primer año, que es el
  primer precio coherente con lo que viene después.
- Si un día sospechoso es un pico que se deshace al día siguiente, se sustituye ese cierre por
  la media de sus vecinos.
- Cualquier otro caso se deja sin tocar y se marca para revisión manual.

Uso: python3 herramientas/datos.py   (escribe en datos/)
"""
import json
import pathlib
import sys

import numpy as np
import pandas as pd
import yfinance as yf

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "datos"
UMBRAL_MOVIMIENTO = 0.08
UMBRAL_DIFERENCIA = 0.06
DIAS_PRIMER_AÑO = 365
HUECO_MAXIMO_DIAS = 7
COBERTURA_MINIMA = 0.95  # fracción de sesiones de Xetra con precio en un año
CALENDARIO = "EXSA.DE"   # serie de referencia para el calendario de sesiones de Xetra
REPETIDOS_MAXIMO = 5

# ticker de Xetra (euros), clase de activo, referencia y divisa de la referencia
UNIVERSO = [
    ("VWCE.DE", "bolsa mundial (todas las capitalizaciones)", "^GSPC", "USD"),
    ("EUNL.DE", "bolsa mundial desarrollada", "^GSPC", "USD"),
    ("SXR8.DE", "bolsa EE. UU. (S&P 500)", "^GSPC", "USD"),
    ("SXRV.DE", "bolsa EE. UU. (Nasdaq 100)", "^NDX", "USD"),
    ("EXSA.DE", "bolsa Europa (STOXX 600)", "^STOXX", "EUR"),
    ("IS3N.DE", "bolsa emergente", "EEM", "USD"),
    ("EUNH.DE", "bonos de gobiernos euro", None, None),
    ("4GLD.DE", "oro físico", "GC=F", "USD"),
    ("XEON.DE", "monetario en euros", None, None),
]


def bajar(ticker):
    d = yf.download(ticker, period="max", interval="1d", auto_adjust=True, progress=False)
    if d.empty:
        return None
    c = d["Close"].squeeze().dropna()
    c.index = pd.to_datetime(c.index).tz_localize(None)
    return c


def en_euros(serie, divisa, eurusd):
    if divisa == "EUR" or serie is None:
        return serie
    tipo = eurusd.reindex(serie.index).ffill()
    return (serie / tipo).dropna()


def validar(ticker, serie, ref):
    notas, sospechosos = [], []
    if (serie <= 0).any():
        notas.append(f"{int((serie <= 0).sum())} precios no positivos (eliminados)")
        serie = serie[serie > 0]
    huecos = serie.index.to_series().diff().dt.days
    for fecha, dias in huecos[huecos > HUECO_MAXIMO_DIAS].items():
        notas.append(f"hueco de {dias} días antes de {fecha.date()}")
    repetidos = (serie.diff() == 0).astype(int)
    racha = repetidos.groupby((repetidos == 0).cumsum()).cumsum()
    if racha.max() >= REPETIDOS_MAXIMO:
        notas.append(f"precio repetido {int(racha.max())} días seguidos (hasta {racha.idxmax().date()})")
    r = serie.pct_change()
    if ref is not None:
        rr = ref.reindex(serie.index).ffill().pct_change()
        malo = (r.abs() > UMBRAL_MOVIMIENTO) & ((r - rr).abs() > UMBRAL_DIFERENCIA)
    else:
        malo = r.abs() > UMBRAL_MOVIMIENTO
    sospechosos = list(r[malo].index)
    return serie, notas, sospechosos, r


def corregir(serie, sospechosos, r):
    acciones, sin_resolver = [], []
    # Arranque defectuoso: tramos congelados en el primer año
    limite = serie.index[0] + pd.Timedelta(days=DIAS_PRIMER_AÑO)
    repetido = (serie.diff() == 0)
    grupo = (~repetido).cumsum()
    largos = repetido.groupby(grupo).sum()
    fin_congelado = None
    for g, n in largos[largos >= REPETIDOS_MAXIMO].items():
        ultimo = repetido[grupo == g].index[-1]
        if ultimo <= limite:
            fin_congelado = ultimo
    if fin_congelado is not None:
        pos = serie.index.get_loc(fin_congelado)
        serie = serie.iloc[pos + 1:]
        acciones.append(f"arranque defectuoso: precio congelado hasta {fin_congelado.date()}; la serie empieza el {serie.index[0].date()}")
        sospechosos = [f for f in sospechosos if f > serie.index[0]]
    inicio = serie.index[0] + pd.Timedelta(days=DIAS_PRIMER_AÑO)
    tempranos = [f for f in sospechosos if f <= inicio and f > serie.index[0]]
    if tempranos:
        corte = max(tempranos)
        serie = serie[serie.index >= corte]
        acciones.append(f"anomalía en el primer año ({corte.date()}, {r.loc[corte]:+.1%} sin movimiento equivalente en la referencia); la serie empieza ese día")
    for f in [f for f in sospechosos if f > inicio and f in serie.index]:
        pos = serie.index.get_loc(f)
        if 0 < pos < len(serie) - 1:
            sube, baja = serie.iloc[pos] / serie.iloc[pos - 1] - 1, serie.iloc[pos + 1] / serie.iloc[pos] - 1
            if abs(sube) > UMBRAL_MOVIMIENTO and np.sign(sube) != np.sign(baja) and abs(serie.iloc[pos + 1] / serie.iloc[pos - 1] - 1) < UMBRAL_DIFERENCIA:
                nuevo = (serie.iloc[pos - 1] + serie.iloc[pos + 1]) / 2
                acciones.append(f"pico aislado el {f.date()} ({sube:+.1%}) sustituido por la media de sus vecinos")
                serie.iloc[pos] = nuevo
                continue
        sin_resolver.append(f"{f.date()} ({r.loc[f]:+.1%})")
    return serie, acciones, sin_resolver


def main():
    (SALIDA / "precios").mkdir(parents=True, exist_ok=True)
    eurusd = bajar("EURUSD=X")
    if eurusd is None:
        print("No se pudo descargar EURUSD=X: sin él no se pueden validar los ETFs con referencia en dólares.")
        return 1
    filas, informe = [], []
    calendario = bajar(CALENDARIO)
    for ticker, clase, ref_ticker, ref_div in UNIVERSO:
        serie = bajar(ticker)
        if serie is None:
            informe.append(f"## {ticker}\n- Sin datos en Yahoo Finance.\n")
            filas.append({"ticker": ticker, "clase": clase, "estado": "sin datos"})
            continue
        ref = en_euros(bajar(ref_ticker), ref_div, eurusd) if ref_ticker else None
        bruto_inicio, bruto_n = serie.index[0].date(), len(serie)
        serie, notas, sospechosos, r = validar(ticker, serie, ref)
        serie, acciones, sin_resolver = corregir(serie, sospechosos, r)
        serie.rename("cierre_ajustado").to_frame().to_csv(SALIDA / "precios" / f"{ticker}.csv", index_label="fecha")
        sesiones = calendario[(calendario.index >= serie.index[0]) & (calendario.index <= serie.index[-1])].index
        cobertura = pd.Series(sesiones.isin(serie.index), index=sesiones).groupby(sesiones.year).mean()
        años_flojos = {int(a): round(float(v), 3) for a, v in cobertura.items() if v < COBERTURA_MINIMA}
        estado = "revisar" if sin_resolver else "ok"
        filas.append({
            "ticker": ticker, "clase": clase,
            "referencia": f"{ref_ticker} en euros" if ref_ticker else "ninguna (solo umbral de movimiento)",
            "desde": str(serie.index[0].date()), "hasta": str(serie.index[-1].date()),
            "sesiones": len(serie), "estado": estado,
            "años_con_cobertura_baja": años_flojos,
        })
        bloque = [f"## {ticker} · {clase}",
                  f"- Descargado: {bruto_n} sesiones desde {bruto_inicio}. Final: {len(serie)} sesiones, {serie.index[0].date()} a {serie.index[-1].date()}.",
                  f"- Referencia: {filas[-1]['referencia']}. Días sospechosos detectados: {len(sospechosos)}."]
        bloque += [f"- Corrección: {a}" for a in acciones]
        bloque += [f"- Aviso: {n}" for n in notas]
        if años_flojos:
            bloque.append("- Cobertura baja (sesiones de Xetra con precio): " + ", ".join(f"{a}: {v:.0%}" for a, v in años_flojos.items())
                          + ". En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.")
        if sin_resolver:
            bloque.append(f"- **Sin resolver, revisar a mano:** {', '.join(sin_resolver)}")
        informe.append("\n".join(bloque) + "\n")
        print(f"{ticker}: {estado} · {serie.index[0].date()} a {serie.index[-1].date()} · sospechosos {len(sospechosos)} · correcciones {len(acciones)} · sin resolver {len(sin_resolver)}")
    (SALIDA / "universo.json").write_text(json.dumps(filas, ensure_ascii=False, indent=1), encoding="utf-8")
    cabecera = [
        "# Informe de calidad de datos",
        "",
        "Generado por `herramientas/datos.py`. Fuente: Yahoo Finance, cierre ajustado diario.",
        f"Regla de sospecha: movimiento diario mayor del {UMBRAL_MOVIMIENTO:.0%} que se separa más de un "
        f"{UMBRAL_DIFERENCIA:.0%} de su referencia en euros.",
        "",
        "Pendiente de confirmar por el dueño: que estos ETFs estén disponibles en Trading 212 (su web no es accesible desde el entorno del agente).",
        "",
    ]
    (SALIDA / "informe_calidad.md").write_text("\n".join(cabecera + informe), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

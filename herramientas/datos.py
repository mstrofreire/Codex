"""Descarga y valida las series diarias del universo de ETFs (tarea T01).

Para cada ETF descarga de Yahoo Finance el cierre ajustado (incluye dividendos y splits) y lo
valida contra una referencia independiente (un índice o un precio en otra divisa convertido a
euros). Un día es sospechoso si el ETF se mueve mucho y su referencia no:

    |rentabilidad ETF| > UMBRAL_MOVIMIENTO  y  |ETF - referencia| > UMBRAL_DIFERENCIA

Además comprueba precios no positivos, huecos largos, precios sin actualizar (el mismo cierre
que la sesión anterior mientras el mercado se movía, que se tratan como huecos) y la cobertura
por año frente a un calendario aproximado de Xetra.

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
COBERTURA_MINIMA = 0.95  # fracción de sesiones con precio válido en un año
UMBRAL_OBSOLETO = 0.002  # si la referencia se mueve más que esto, un precio repetido es sospechoso
MAYORIA_PARADA = 0.6     # fracción del universo que repite precio el mismo día para considerarlo fallo común
FESTIVOS_FIJOS_XETRA = ["01-01", "12-24", "12-25", "12-26", "12-31"]
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


def dias_obsoletos(serie, ref, dias_mercado_parado):
    """Días con el mismo cierre que la sesión anterior mientras el mercado se movió.

    Con referencia: el ETF no cambia y su referencia en euros se mueve más de UMBRAL_OBSOLETO.
    Sin referencia: días en que la mayoría del universo repite el precio a la vez (fallo de Yahoo).
    """
    sin_cambio = serie.diff() == 0
    if ref is not None:
        rr = ref.reindex(serie.index).ffill().pct_change().abs()
        obsoleto = sin_cambio & (rr > UMBRAL_OBSOLETO)
    else:
        obsoleto = sin_cambio & serie.index.isin(dias_mercado_parado)
    return obsoleto | (sin_cambio & serie.index.isin(dias_mercado_parado))


def main():
    (SALIDA / "precios").mkdir(parents=True, exist_ok=True)
    eurusd = bajar("EURUSD=X")
    if eurusd is None:
        print("No se pudo descargar EURUSD=X: sin él no se pueden validar los ETFs con referencia en dólares.")
        return 1
    # 1. Descarga de todo el universo y de las referencias
    brutos, refs = {}, {}
    for ticker, clase, ref_ticker, ref_div in UNIVERSO:
        serie = bajar(ticker)
        if serie is not None:
            serie = serie[~serie.index.strftime("%m-%d").isin(FESTIVOS_FIJOS_XETRA)]
            serie = serie[serie.index.dayofweek < 5]
        brutos[ticker] = serie
        refs[ticker] = en_euros(bajar(ref_ticker), ref_div, eurusd) if ref_ticker else None
    disponibles = [s for s in brutos.values() if s is not None]
    # 2. Días en que la mayoría del universo repite el precio a la vez
    sin_cambio = pd.concat([(s.diff() == 0).rename(i) for i, s in enumerate(disponibles)], axis=1)
    con_dato = sin_cambio.notna().sum(axis=1)
    parados = sin_cambio.fillna(False).sum(axis=1)
    dias_mercado_parado = sin_cambio.index[(con_dato >= 5) & (parados >= MAYORIA_PARADA * con_dato)]
    # 3. Calendario aproximado de Xetra: días laborables con precio en al menos 3 series del universo
    presencia = pd.concat([s.rename(i) for i, s in enumerate(disponibles)], axis=1).notna().sum(axis=1)
    calendario = presencia.index[presencia >= 3]

    filas, informe = [], []
    for ticker, clase, ref_ticker, ref_div in UNIVERSO:
        serie, ref = brutos[ticker], refs[ticker]
        if serie is None:
            informe.append(f"## {ticker}\n- Sin datos en Yahoo Finance.\n")
            filas.append({"ticker": ticker, "clase": clase, "estado": "sin datos"})
            continue
        bruto_inicio, bruto_n = serie.index[0].date(), len(serie)
        serie, notas, sospechosos, r = validar(ticker, serie, ref)
        serie, acciones, sin_resolver = corregir(serie, sospechosos, r)
        obsoleto = dias_obsoletos(serie, ref, dias_mercado_parado)
        por_año_obsoletos = obsoleto.groupby(serie.index.year).sum()
        serie = serie[~obsoleto]
        if obsoleto.any():
            acciones.append(f"{int(obsoleto.sum())} días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) "
                            "tratados como huecos: " + ", ".join(f"{a}: {int(n)}" for a, n in por_año_obsoletos.items() if n))
        serie.rename("cierre_ajustado").to_frame().to_csv(SALIDA / "precios" / f"{ticker}.csv", index_label="fecha")
        sesiones = calendario[(calendario >= serie.index[0]) & (calendario <= serie.index[-1])]
        cobertura = pd.Series(sesiones.isin(serie.index), index=sesiones).groupby(sesiones.year).mean()
        años_flojos = {int(a): round(float(v), 3) for a, v in cobertura.items() if v < COBERTURA_MINIMA}
        estado = "revisar" if sin_resolver else ("ok con avisos" if años_flojos else "ok")
        filas.append({
            "ticker": ticker, "clase": clase,
            "referencia": f"{ref_ticker} en euros" if ref_ticker else "ninguna: solo umbral de movimiento y fallos comunes a todo el universo",
            "desde": str(serie.index[0].date()), "hasta": str(serie.index[-1].date()),
            "sesiones": len(serie), "estado": estado,
            "dias_obsoletos_eliminados": int(obsoleto.sum()),
            "años_con_cobertura_baja": años_flojos,
        })
        bloque = [f"## {ticker} · {clase}",
                  f"- Descargado: {bruto_n} sesiones desde {bruto_inicio}. Final: {len(serie)} sesiones, {serie.index[0].date()} a {serie.index[-1].date()}.",
                  f"- Referencia: {filas[-1]['referencia']}. Días con movimiento sospechoso: {len(sospechosos)}."]
        bloque += [f"- Corrección: {a}" for a in acciones]
        bloque += [f"- Aviso: {n}" for n in notas]
        if años_flojos:
            bloque.append("- Cobertura baja (sesiones con precio válido frente al calendario aproximado): "
                          + ", ".join(f"{a}: {v:.0%}" for a, v in años_flojos.items())
                          + ". En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.")
        if sin_resolver:
            bloque.append(f"- **Sin resolver, revisar a mano:** {', '.join(sin_resolver)}")
        informe.append("\n".join(bloque) + "\n")
        print(f"{ticker}: {estado} · {serie.index[0].date()} a {serie.index[-1].date()} · obsoletos {int(obsoleto.sum())} · años flojos {list(años_flojos)} · sin resolver {len(sin_resolver)}")
    (SALIDA / "universo.json").write_text(json.dumps(filas, ensure_ascii=False, indent=1), encoding="utf-8")
    cabecera = [
        "# Informe de calidad de datos",
        "",
        "Generado por `herramientas/datos.py`. Fuente: Yahoo Finance, cierre ajustado diario.",
        "",
        "Reglas:",
        f"- Movimiento sospechoso: más del {UMBRAL_MOVIMIENTO:.0%} en un día y más de un {UMBRAL_DIFERENCIA:.0%} de diferencia con su referencia en euros "
        "(sin referencia, solo el umbral del movimiento).",
        f"- Precio sin actualizar: mismo cierre que la sesión anterior mientras la referencia se movió más de un {UMBRAL_OBSOLETO:.1%}, "
        f"o en un día en que al menos el {MAYORIA_PARADA:.0%} del universo repitió precio a la vez. Se trata como hueco.",
        "- Calendario aproximado de Xetra: días laborables con precio en al menos 3 series del universo, sin festivos fijos "
        "(1 de enero, 24, 25, 26 y 31 de diciembre). No es el calendario oficial.",
        f"- Días de mercado parado detectados en todo el universo: {len(dias_mercado_parado)}"
        + (f" ({', '.join(str(d.date()) for d in dias_mercado_parado[:10])}{'…' if len(dias_mercado_parado) > 10 else ''})." if len(dias_mercado_parado) else "."),
        "",
        "Pendiente de confirmar por el dueño: que estos ETFs estén disponibles en Trading 212 (tarea T12).",
        "",
    ]
    (SALIDA / "informe_calidad.md").write_text("\n".join(cabecera + informe), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Informe de calidad de datos

Generado por `herramientas/datos.py`. Fuente: Yahoo Finance, cierre ajustado diario.

Reglas:
- Movimiento sospechoso: más del 8% en un día y más de un 6% de diferencia con su referencia en euros (sin referencia, solo el umbral del movimiento).
- Precio sin actualizar: mismo cierre que la sesión anterior mientras la referencia se movió más de un 0.2%, o en un día en que al menos el 60% del universo repitió precio a la vez. Se trata como hueco.
- Calendario aproximado de Xetra: días laborables con precio en al menos 3 series del universo, sin festivos fijos (1 de enero, 24, 25, 26 y 31 de diciembre). No es el calendario oficial.
- Días de mercado parado detectados en todo el universo: 7 (2017-06-05, 2017-10-03, 2017-10-31, 2018-05-21, 2023-12-04, 2023-12-05, 2023-12-06).

Pendiente de confirmar por el dueño: que estos ETFs estén disponibles en Trading 212 (tarea T12).

## VWCE.DE · bolsa mundial (todas las capitalizaciones)
- Descargado: 1840 sesiones desde 2019-07-29. Final: 1831 sesiones, 2019-07-29 a 2026-10-22.
- Referencia: ^GSPC en euros. Días con movimiento sospechoso: 0.
- Corrección: 9 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2020: 1, 2022: 2, 2023: 5, 2026: 1

## EUNL.DE · bolsa mundial desarrollada
- Descargado: 4335 sesiones desde 2009-09-25. Final: 4240 sesiones, 2009-10-21 a 2026-10-22.
- Referencia: ^GSPC en euros. Días con movimiento sospechoso: 0.
- Corrección: arranque defectuoso: precio congelado hasta 2009-10-20; la serie empieza el 2009-10-21
- Corrección: 77 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2009: 4, 2010: 22, 2011: 14, 2012: 9, 2013: 8, 2014: 1, 2015: 4, 2017: 7, 2018: 2, 2023: 4, 2025: 2
- Aviso: precio repetido 17 días seguidos (hasta 2009-10-20)
- Cobertura baja (sesiones con precio válido frente al calendario aproximado): 2009: 92%, 2010: 91%, 2011: 94%. En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.

## SXR8.DE · bolsa EE. UU. (S&P 500)
- Descargado: 4173 sesiones desde 2010-05-19. Final: 4010 sesiones, 2010-11-01 a 2026-10-22.
- Referencia: ^GSPC en euros. Días con movimiento sospechoso: 1.
- Corrección: arranque defectuoso: precio congelado hasta 2010-10-29; la serie empieza el 2010-11-01
- Corrección: 45 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2010: 8, 2011: 23, 2012: 1, 2013: 2, 2014: 1, 2017: 4, 2018: 1, 2019: 1, 2023: 4
- Aviso: precio repetido 19 días seguidos (hasta 2010-10-29)
- Cobertura baja (sesiones con precio válido frente al calendario aproximado): 2010: 81%, 2011: 91%. En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.

## SXRV.DE · bolsa EE. UU. (Nasdaq 100)
- Descargado: 4124 sesiones desde 2010-05-07. Final: 3987 sesiones, 2010-11-01 a 2026-10-22.
- Referencia: ^NDX en euros. Días con movimiento sospechoso: 1.
- Corrección: anomalía en el primer año (2010-11-01, -27.8% sin movimiento equivalente en la referencia); la serie empieza ese día
- Corrección: 24 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2012: 2, 2013: 2, 2016: 1, 2017: 2, 2018: 3, 2019: 1, 2020: 1, 2023: 5, 2024: 3, 2025: 4
- Aviso: hueco de 10.0 días antes de 2010-09-30
- Aviso: hueco de 8.0 días antes de 2011-04-27
- Cobertura baja (sesiones con precio válido frente al calendario aproximado): 2010: 93%, 2011: 84%. En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.

## EXSA.DE · bolsa Europa (STOXX 600)
- Descargado: 4776 sesiones desde 2008-01-02. Final: 4761 sesiones, 2008-01-02 a 2026-10-22.
- Referencia: ^STOXX en euros. Días con movimiento sospechoso: 0.
- Corrección: 15 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2009: 2, 2012: 2, 2013: 1, 2014: 1, 2016: 1, 2017: 2, 2018: 1, 2020: 1, 2022: 1, 2023: 3

## IS3N.DE · bolsa emergente
- Descargado: 3140 sesiones desde 2014-06-11. Final: 3113 sesiones, 2014-06-11 a 2026-10-22.
- Referencia: EEM en euros. Días con movimiento sospechoso: 0.
- Corrección: 27 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2014: 4, 2015: 5, 2016: 5, 2017: 7, 2018: 3, 2023: 3

## EUNH.DE · bonos de gobiernos euro
- Descargado: 4451 sesiones desde 2009-04-17. Final: 4444 sesiones, 2009-04-17 a 2026-10-22.
- Referencia: ninguna: solo umbral de movimiento y fallos comunes a todo el universo. Días con movimiento sospechoso: 0.
- Corrección: 7 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2017: 3, 2018: 1, 2023: 3

## 4GLD.DE · oro físico
- Descargado: 4299 sesiones desde 2009-11-13. Final: 4266 sesiones, 2009-11-13 a 2026-10-22.
- Referencia: GC=F en euros. Días con movimiento sospechoso: 0.
- Corrección: 33 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2009: 1, 2010: 2, 2011: 1, 2012: 4, 2013: 2, 2014: 2, 2015: 1, 2016: 3, 2017: 6, 2018: 2, 2019: 1, 2020: 1, 2021: 1, 2022: 2, 2023: 3, 2026: 1

## XEON.DE · monetario en euros
- Descargado: 4778 sesiones desde 2008-01-02. Final: 4771 sesiones, 2008-01-02 a 2026-10-22.
- Referencia: ninguna: solo umbral de movimiento y fallos comunes a todo el universo. Días con movimiento sospechoso: 0.
- Corrección: 7 días con el precio sin actualizar (igual al día anterior mientras el mercado se movía) tratados como huecos: 2017: 3, 2018: 1, 2023: 3
- Aviso: precio repetido 7 días seguidos (hasta 2013-10-28)

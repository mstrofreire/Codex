# Informe de calidad de datos

Generado por `herramientas/datos.py`. Fuente: Yahoo Finance, cierre ajustado diario.
Regla de sospecha: movimiento diario mayor del 8% que se separa más de un 6% de su referencia en euros.

Pendiente de confirmar por el dueño: que estos ETFs estén disponibles en Trading 212 (su web no es accesible desde el entorno del agente).

## VWCE.DE · bolsa mundial (todas las capitalizaciones)
- Descargado: 1840 sesiones desde 2019-07-29. Final: 1840 sesiones, 2019-07-29 a 2026-10-22.
- Referencia: ^GSPC en euros. Días sospechosos detectados: 0.

## EUNL.DE · bolsa mundial desarrollada
- Descargado: 4336 sesiones desde 2009-09-25. Final: 4318 sesiones, 2009-10-21 a 2026-10-22.
- Referencia: ^GSPC en euros. Días sospechosos detectados: 0.
- Corrección: arranque defectuoso: precio congelado hasta 2009-10-20; la serie empieza el 2009-10-21
- Aviso: precio repetido 17 días seguidos (hasta 2009-10-20)

## SXR8.DE · bolsa EE. UU. (S&P 500)
- Descargado: 4174 sesiones desde 2010-05-19. Final: 4056 sesiones, 2010-11-01 a 2026-10-22.
- Referencia: ^GSPC en euros. Días sospechosos detectados: 1.
- Corrección: arranque defectuoso: precio congelado hasta 2010-10-29; la serie empieza el 2010-11-01
- Aviso: precio repetido 19 días seguidos (hasta 2010-10-29)

## SXRV.DE · bolsa EE. UU. (Nasdaq 100)
- Descargado: 4124 sesiones desde 2010-05-07. Final: 4011 sesiones, 2010-11-01 a 2026-10-22.
- Referencia: ^NDX en euros. Días sospechosos detectados: 1.
- Corrección: anomalía en el primer año (2010-11-01, -27.8% sin movimiento equivalente en la referencia); la serie empieza ese día
- Aviso: hueco de 10.0 días antes de 2010-09-30
- Aviso: hueco de 8.0 días antes de 2011-04-27
- Cobertura baja (sesiones de Xetra con precio): 2010: 93%, 2011: 84%. En esos años la serie tiene huecos y los movimientos de varios días parecen de uno; mejor no usarlos para medir volatilidad.

## EXSA.DE · bolsa Europa (STOXX 600)
- Descargado: 4776 sesiones desde 2008-01-02. Final: 4776 sesiones, 2008-01-02 a 2026-10-22.
- Referencia: ^STOXX en euros. Días sospechosos detectados: 0.

## IS3N.DE · bolsa emergente
- Descargado: 3140 sesiones desde 2014-06-11. Final: 3140 sesiones, 2014-06-11 a 2026-10-22.
- Referencia: EEM en euros. Días sospechosos detectados: 0.

## EUNH.DE · bonos de gobiernos euro
- Descargado: 4451 sesiones desde 2009-04-17. Final: 4451 sesiones, 2009-04-17 a 2026-10-22.
- Referencia: ninguna (solo umbral de movimiento). Días sospechosos detectados: 0.

## 4GLD.DE · oro físico
- Descargado: 4299 sesiones desde 2009-11-13. Final: 4299 sesiones, 2009-11-13 a 2026-10-22.
- Referencia: GC=F en euros. Días sospechosos detectados: 0.

## XEON.DE · monetario en euros
- Descargado: 4779 sesiones desde 2008-01-02. Final: 4779 sesiones, 2008-01-02 a 2026-10-22.
- Referencia: ninguna (solo umbral de movimiento). Días sospechosos detectados: 0.
- Aviso: precio repetido 7 días seguidos (hasta 2013-10-28)

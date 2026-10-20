# Bitácora del agente

Cada sesión añade una entrada al final: fecha, qué hizo, qué sigue, qué necesita del dueño.

## Hoja de ruta (cada sesión toma la primera tarea pendiente)
- [ ] 1. Universo de ETFs UCITS en euros disponibles en Trading 212 (bolsa mundial, EE. UU., bonos euro, oro, monetario) y fuentes de datos con historia larga (ETF + índice proxy).
- [ ] 2. Motor de backtest propio: costes del bróker, impuestos españoles (FIFO, regla de los dos meses), rebalanceo con bandas.
- [ ] 3. Validar el motor reproduciendo una estrategia publicada (filtro de 10 meses de Faber).
- [ ] 4. Estrategia núcleo: tendencia multiactivo con objetivo de volatilidad, frente a VWCE.
- [ ] 5. Prueba de fuego (ver CONOCIMIENTO.md): validación por bloques, Sharpe deflactado, probabilidad de sobreajuste, parámetros ±10 %, costes +50 %, solo activos líquidos, registro de intentos y veredicto VALIDADA / COMPROMISO / SIN VENTAJA.
- [ ] 6. Estrategia cripto (BTC/ETH vs euros), mismo laboratorio. Solo si el dueño la aprueba.
- [ ] 7. Estrategia IA: proceso semanal del agente con fuentes (SEC, noticias, macro) en modo sombra.
- [ ] 8. Motor de riesgo y ejecutor (GitHub Actions), primero en simulado.
- [ ] 9. Asignador de capital entre estrategias y reglas de supervivencia.
- [ ] 10. Modo sombra completo durante 1 semana; luego papel.
- [ ] 11. Investigar la observación "estructura de mercado" (Polymarket y similares): legalidad en España, acceso, capital y competencia. Solo investigación.

## Entradas

### 2026-10-20
- Hecho: constitución y hoja de ruta. Informe diario programado.
- Sigue: tarea 1 (universo de ETFs y datos).
- Necesito del dueño: nada por ahora. Más adelante: cuentas en Trading 212 (y Bitvavo si hay cripto) y sus claves API, guardadas como secretos de GitHub.
- Prueba de la rutina diaria: hizo bien la tarea 1 (31 series descargadas; detectó libras/peniques mezclados en tickers de Londres y un −24,6 % falso en SXR8 en nov-2010), pero no pudo hacer push (403: repo no autorizado en la rutina). Ese trabajo se perdió; se repetirá. Rutina cambiada a Opus 5.5.
- Añadido CONOCIMIENTO.md con lo aprendido de 7 artículos de X: ciclo observación → tesis → prueba de fuego → veredicto → retroalimentación; reglas de rutinas; modo sombra; ventajas estructurales; señales de estafa.

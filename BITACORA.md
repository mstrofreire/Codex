# Bitácora del agente

Cada sesión añade una entrada al final: fecha, qué hizo, qué sigue, qué necesita del dueño.

## Hoja de ruta
El estado de cada tarea vive en `TAREAS.md`. Esta bitácora guarda solo el relato fechado
de cada sesión: qué se hizo y por qué.

## Entradas

### 2026-10-20
- Hecho: constitución y hoja de ruta. Informe diario programado.
- Sigue: tarea 1 (universo de ETFs y datos).
- Necesito del dueño: nada por ahora. Más adelante: cuentas en Trading 212 (y Bitvavo si hay cripto) y sus claves API, guardadas como secretos de GitHub.
- Prueba de la rutina diaria: hizo bien la tarea 1 (31 series descargadas; detectó libras/peniques mezclados en tickers de Londres y un −24,6 % falso en SXR8 en nov-2010), pero no pudo hacer push (403: repo no autorizado en la rutina). Ese trabajo se perdió; se repetirá. Rutina cambiada a Opus 5.5.
- Añadido CONOCIMIENTO.md con lo aprendido de 7 artículos de X: ciclo observación → tesis → prueba de fuego → veredicto → retroalimentación; reglas de rutinas; modo sombra; ventajas estructurales; señales de estafa.

### 2026-10-23
- Hecho: analizados TradingAgents, @igus_ai y el artículo de @0xkvro sobre equipos de agentes.
- Decisión: el estado del trabajo pasa a `TAREAS.md` con estados que exigen pruebas
  (PENDIENTE, EN_CURSO, VERIFICANDO, HECHA, BLOQUEADA) y revisión independiente antes de dar
  algo por hecho. Motivo: una bitácora narrativa no dice qué está verificado y qué no.
- Decisión: la memoria distingue reglas, observaciones con fecha, estado de tareas y evidencia actual.
- Sigue: X01 e I01 dependen del dueño; T01 es la siguiente tarea del agente.

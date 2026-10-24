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

### 2026-10-23 (tarde)
- El dueño no puede cambiar ajustes de GitHub ni de rutinas desde el móvil.
- Decisión: la rutina diaria pasa a ejecutarse dentro de la conversación principal, que tiene
  acceso de escritura; la rutina antigua queda desactivada. Motivo: desbloquear sin pedir nada al dueño.
- Decisión: no cambiar la rama principal de mstrofreire/codex, porque contiene otro proyecto del
  dueño (vídeos electorales por provincia y NEGOCIO-GROK.md). El Filtro irá a su propio repositorio.

### 2026-10-23 (noche): decisiones del dueño
- Cripto: sí. La tarea T06 (estrategia BTC/ETH frente a euros) pasa de BLOQUEADA a PENDIENTE,
  con las mismas reglas de laboratorio que el resto.
- Kit: gratis por ahora.
- Hilos de la cola: el dueño contestó "vale"; la aprobación queda pendiente de confirmación
  explícita hilo a hilo antes de marcarlos como aprobados.

### 2026-10-23 (noche): kit verificado
- Prueba de punta a punta del kit en una sesión limpia de Claude Code: funcionó el turno completo
  y los bloqueos de editar publicado/ y leer .env.
- Primera revisión independiente: FALLA por afirmaciones exageradas en el README (los permisos no
  cubren la consola; el revisor tiene consola; "probado en un proyecto real"; el control de GitHub
  solo avisa). Corregidas. Segunda: FALLA por falta de pruebas guardadas de la lectura de .env.
  Repetida con prompt, ruta y llamada exactas. Tercera: PASA.
- Lección: la revisión independiente funciona; encontró errores del propio autor que él no vio.

### 2026-10-23 (noche): aprobaciones y publicación del kit
- El dueño aprobó de forma explícita los 5 hilos de la cola ("Apruebo los 5 hilos de la cola
  para publicarlos en X"). Marcados con aprobado: si. Saldrán cuando exista la cuenta y sus claves.
- El dueño creó el repositorio público mstrofreire/equipo-ia. Publicado el kit con licencia MIT
  y las pruebas. Decisión: MIT para que se pueda usar sin trabas, también comercialmente.
- Hilo de lanzamiento del kit escrito y en la cola, pendiente de aprobación.

### 2026-10-24 · turno diario (primer turno automático)
- I01: el push desde la rutina funciona (commit e6e89c3). Rutina diaria operativa.
- T01: universo de 9 ETFs y validador de datos. Detecta y corrige solo los errores conocidos.
  Pendiente de revisión independiente. La disponibilidad en Trading 212 pasa a T12 (dueño).
- X04: la revisión independiente dio FALLA. (1) El correo personal del dueño aparece en el commit
  inicial del repositorio público. (2) El post 1 del hilo exageraba. Corregido el hilo (vuelve a
  "aprobado: no") y las mejoras técnicas del kit. Lo del correo lo decide el dueño.
- Lección: el comprobador mejorado detectó un identificador de tarea mal formado ("T01b") escrito
  por el propio agente. Renombrado a T12.

### 2026-10-24 · turno diario: T01 bloqueada
- T01, primera revisión: FALLA (precios repetidos sin actualizar no detectados; dos frases
  exageradas). Decisión: tratar esos días como huecos, no rellenarlos. Motivo: inventar un precio
  falsearía el backtest; un hueco se ve.
- T01, segunda revisión: FALLA. Quedan 6 días sin actualizar en 3 series, por dos causas
  concretas (comparación con el día anterior del bruto y festivos de EE. UU.). Los datos coinciden
  con una descarga independiente.
- Decisión: T01 pasa a BLOQUEADA por la regla "si el mismo arreglo falla dos veces". Motivo: la
  regla existe para no seguir parcheando lo mismo. El siguiente intento será un enfoque distinto
  (quitar rachas enteras y referencia sobre la unión de calendarios), anotado en TAREAS.md.
- Efecto práctico: 6 días de unas 35.000 sesiones. No bloquea pensar el motor de backtest (T02).

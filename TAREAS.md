# Registro de tareas

Fuente de verdad del estado del trabajo. Cualquier sesión nueva continúa desde aquí, sin
depender de recordar conversaciones. Formato tomado de @0xkvro (23-10-2026), ver CONOCIMIENTO.md.

## Estados posibles (cada cambio exige una prueba)
- **PENDIENTE**: no empezada.
- **EN_CURSO**: alguien trabaja en ella; tiene un punto de control.
- **VERIFICANDO**: hay resultado; falta una revisión independiente (otra sesión o subagente
  que mira los archivos y resultados reales, no el resumen).
- **HECHA**: revisión con resultado PASA y pruebas enlazadas.
- **BLOQUEADA**: falta algo; se dice exactamente qué y de quién depende.

Reglas:
- Nada pasa a HECHA porque alguien diga que funciona: hace falta la prueba (archivo, salida de un test, commit).
- Si el mismo arreglo falla dos veces, la tarea pasa a BLOQUEADA y se explica.
- Publicar, operar con dinero, borrar datos o tocar claves exige aprobación del dueño.

## Formato de punto de control
```
ID · título
ESTADO:
OBJETIVO:
HECHO:
VERIFICADO:
PENDIENTE:
APROBACIÓN:
SIGUIENTE:
```

---

## Proyecto El Filtro (cuenta de X)

X01 · Cuenta de X operativa
ESTADO: BLOQUEADA (depende del dueño)
OBJETIVO: cuenta "El Filtro" con etiqueta de automatizada, claves de API guardadas en secretos de GitHub y publicación programada funcionando.
HECHO: programa de publicación (herramientas/publicar_x.py), flujo de GitHub Actions, reglas (x/REGLAS.md), estilo (x/ESTILO.md).
VERIFICADO: firma OAuth igual al ejemplo oficial de X; simulación de publicación correcta; los 5 hilos de la cola pasan el límite de 280 caracteres.
PENDIENTE: crear la cuenta, sacar las 4 claves, guardarlas en GitHub, poner `claude/kronos-repo-9qxm1t` como rama principal (los flujos programados solo corren en la rama principal).
APROBACIÓN: cada hilo necesita `aprobado: si` durante la primera semana.
SIGUIENTE: cuando haya claves, lanzar el flujo a mano una vez y comprobar el primer post publicado.

X02 · El Filtro Nº 2
ESTADO: EN_CURSO
OBJETIVO: entre 8 y 12 publicaciones analizadas y página publicada.
HECHO: 3 tarjetas en filtro/n02-tarjetas.md (@0xkvro señal/ruido, TradingAgents, @igus_ai).
VERIFICADO: cifras comprobadas con datos propios (PCA de 494 acciones; precios de S&P 500 y Bitcoin).
PENDIENTE: más publicaciones; maquetar la página.
APROBACIÓN: no requerida para preparar; sí para publicar en X.
SIGUIENTE: añadir los enlaces que pase el dueño.

X03 · Kit "tu equipo de IA en Claude Code"
ESTADO: VERIFICANDO
OBJETIVO: plantilla en español, lista para copiar, con reglas, registro de tareas, memoria con fecha, 4 especialistas, procedimiento de turno, comprobador en código y rutina.
HECHO: carpeta kit-equipo-ia/ con README, CLAUDE.md, TAREAS.md, MEMORIA.md, BITACORA.md, RUTINA.md, 4 subagentes, skill turno-de-noche, comprobador y control de GitHub.
VERIFICADO: el comprobador detecta 6 de 6 errores provocados y aprueba la plantilla y nuestro TAREAS.md; los 5 archivos de .claude tienen cabecera válida.
REVISIÓN:
PENDIENTE: prueba de punta a punta en una sesión nueva de Claude Code (tarea T01 del kit) y revisión independiente.
APROBACIÓN: el dueño decide si se publica gratis, de pago o como imán de la cuenta de X.
SIGUIENTE: ejecutar la tarea T01 del kit en una sesión limpia y guardar su informe.

## Proyecto agente de inversión (laboratorio)

T01 · Universo de ETFs y datos con historia larga
ESTADO: PENDIENTE
OBJETIVO: lista de ETFs UCITS en euros disponibles en Trading 212 y series de precios largas y limpias.
HECHO: una ejecución de prueba descargó 31 series, pero no pudo guardarlas (sin acceso de escritura).
VERIFICADO: errores de datos detectados en esa prueba: tickers de Londres mezclan libras y peniques; SXR8 tiene un −24,6 % falso en noviembre de 2010.
PENDIENTE: repetir la descarga y corregir esos errores; confirmar qué ETFs ofrece Trading 212 (su web está bloqueada desde aquí).
APROBACIÓN: no.
SIGUIENTE: repetir la descarga con validación de datos.

T02 · Motor de backtest con costes e impuestos españoles · PENDIENTE
T03 · Validar el motor reproduciendo el filtro de 10 meses de Faber · PENDIENTE
T04 · Estrategia núcleo: tendencia multiactivo frente a VWCE · PENDIENTE
T05 · Prueba de fuego estadística (ver CONOCIMIENTO.md) · PENDIENTE
T06 · Estrategia cripto (BTC/ETH) · BLOQUEADA: el dueño aún no ha decidido si incluir cripto
T07 · Estrategia IA en modo sombra · PENDIENTE
T08 · Motor de riesgo y ejecutor simulado · PENDIENTE
T09 · Asignador de capital y reglas de supervivencia · PENDIENTE
T10 · Una semana de modo sombra; después papel · PENDIENTE
T11 · Investigar ventajas de estructura (Polymarket y similares): legalidad en España · PENDIENTE

## Infraestructura

I01 · Rutina diaria con acceso de escritura al repositorio
ESTADO: BLOQUEADA (depende del dueño)
OBJETIVO: que la rutina diaria pueda guardar su trabajo en GitHub.
VERIFICADO: la prueba del 20-10-2026 falló al hacer push (error 403, repositorio no autorizado en la rutina).
PENDIENTE: añadir `mstrofreire/codex` a la rutina en claude.ai/code → Routines.
SIGUIENTE: lanzar la rutina a mano y comprobar que el commit llega a GitHub.

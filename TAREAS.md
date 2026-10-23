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
PENDIENTE: crear la cuenta, sacar las 4 claves y guardarlas en GitHub (necesita navegador en modo escritorio u ordenador). No se cambia la rama principal de mstrofreire/codex: contiene otro proyecto del dueño (vídeos electorales). Alternativa decidida el 23-10-2026: El Filtro tendrá su propio repositorio cuando se cree la cuenta.
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
ESTADO: HECHA
OBJETIVO: plantilla en español, lista para copiar, con reglas, registro de tareas, memoria con fecha, 4 especialistas, procedimiento de turno, comprobador en código, permisos y rutina.
HECHO: carpeta kit-equipo-ia/. Prueba de punta a punta el 23-10-2026 en una sesión limpia de Claude Code: turno completo (constructor, revisor PASA, informador, commit), bloqueo de editar publicado/ y de leer .env. Textos corregidos tras dos revisiones con FALLA (afirmaciones exageradas sobre permisos, revisor y pruebas).
VERIFICADO: pruebas/kit-e2e/ (salida_turno.txt, git-log.txt, TAREAS y MEMORIA tras el turno, salida_permisos.txt, salida_permisos_env.txt con prompt, ruta y llamada exactas, salida_comprobador_errores.txt con 6 de 6 errores detectados).
REVISIÓN: PASA (pruebas/kit-e2e/revision-independiente-3.txt, sesión independiente de solo lectura, 23-10-2026). Las anteriores, con FALLA, en revision-independiente.txt y -2.txt.
PENDIENTE: nada para la tarea. Sin probar todavía: varios días como rutina, una tarea BLOQUEADA y el push a un remoto (dicho en el README).
APROBACIÓN: el dueño decidió el 23-10-2026 publicarlo gratis.
SIGUIENTE: X04.

X04 · Publicar el kit gratis
ESTADO: BLOQUEADA: falta un repositorio público propio (por ejemplo mstrofreire/equipo-ia), que tiene que crear el dueño
OBJETIVO: el kit en un repositorio público con licencia y un hilo de lanzamiento en la cola de X.
PENDIENTE: que el dueño cree el repositorio vacío y público; después, copiar el kit, añadir licencia y preparar el hilo.

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
T06 · Estrategia cripto (BTC/ETH) · PENDIENTE
T07 · Estrategia IA en modo sombra · PENDIENTE
T08 · Motor de riesgo y ejecutor simulado · PENDIENTE
T09 · Asignador de capital y reglas de supervivencia · PENDIENTE
T10 · Una semana de modo sombra; después papel · PENDIENTE
T11 · Investigar ventajas de estructura (Polymarket y similares): legalidad en España · PENDIENTE

## Infraestructura

I01 · Rutina diaria con acceso de escritura al repositorio
ESTADO: VERIFICANDO
OBJETIVO: que el agente diario pueda guardar su trabajo en GitHub sin que el dueño tenga que tocar ajustes (desde el móvil no puede).
HECHO: 23-10-2026: la rutina antigua (sesión nueva sin acceso al repo) queda desactivada. Nueva rutina "Agente diario (en esta conversación)" a las 8:52 de Madrid, que se ejecuta dentro de la sesión que sí tiene acceso de escritura.
VERIFICADO: rutina creada y activa, próxima ejecución 24-10-2026 08:52 (Madrid). La rutina antigua se paró a los 24 s el 23-10 por falta de acceso (observación superada por este cambio).
REVISIÓN:
PENDIENTE: confirmar que la primera ejecución hace push de verdad.
APROBACIÓN: no.
SIGUIENTE: revisar el commit de la ejecución del 24-10-2026.

# Kit: tu equipo de IA en Claude Code

Un equipo de cuatro especialistas y un coordinador que trabaja solo cada día, deja pruebas
de lo que hace y te pide permiso para lo importante. En español y listo para copiar.

## El problema que resuelve
Casi todo el mundo usa la IA como un chat: preguntas, copias, cierras. Y cuando intenta
que trabaje sola, aparecen siempre los mismos fallos:
- **Dice que ha terminado y no es verdad.** Nadie comprueba el trabajo.
- **Cada sesión empieza de cero.** El estado se pierde en conversaciones viejas.
- **Recuerda cosas que ya no son ciertas** y decide con la verdad de ayer.
- **Hace cosas que no debía**, porque el único límite era una frase en el prompt.

## Cómo lo resuelve
| Pieza | Archivo | Qué evita |
|---|---|---|
| Reglas que se leen siempre | `CLAUDE.md` | Que cada sesión invente su forma de trabajar |
| Registro de tareas con estados | `TAREAS.md` | Perder el hilo entre sesiones |
| Memoria con tipo, fuente y fecha | `MEMORIA.md` | Decidir con información caducada |
| Cuatro especialistas | `.claude/agents/` | Que un solo agente se dé el visto bueno a sí mismo |
| Procedimiento del turno | `.claude/skills/turno-de-noche/` | Turnos sin orden ni reglas de parada |
| Permisos de Claude Code | `.claude/settings.json` | Que las herramientas de leer y editar de Claude abran tus claves o toquen lo ya aprobado (la consola no queda cubierta: ver abajo) |
| Comprobador en código | `herramientas/comprobar_tareas.py` | Tareas "hechas" sin pruebas ni revisión |
| Control en GitHub | `.github/workflows/` | Que un cambio en las tareas sin pruebas pase desapercibido (bloquea de verdad solo si proteges la rama) |
| La rutina para pegar | `RUTINA.md` | Tener que pedirle cada día que trabaje |

## El equipo
- **Coordinador** (la sesión principal): reparte, sigue el estado, no se cree nada sin pruebas.
- **Investigador**: averigua antes de construir. No tiene herramientas para modificar archivos.
- **Constructor**: hace el trabajo y guarda las pruebas.
- **Revisor**: comprueba el trabajo real y dictamina PASA, FALLA o BLOQUEADA. Tiene la consola para repetir comprobaciones, así que no modificar nada es una norma de su papel, no un límite técnico.
- **Informador**: escribe el informe de la mañana: Hecho / Verificado / Falló o bloqueado / Necesito de ti.

## Ponerlo en marcha (unos 15 minutos)
1. Copia el contenido de esta carpeta en la raíz de un repositorio tuyo de GitHub, o en la
   carpeta de tu proyecto. El control de GitHub (`.github/`) solo funciona en la raíz del repositorio.
2. Abre `CLAUDE.md` y escribe en "Qué es este proyecto" lo que quieres que haga tu equipo.
   En `MEMORIA.md`, cambia "(pon la fecha de hoy)" por la fecha en formato AAAA-MM-DD.
3. En `TAREAS.md`, deja la tarea T01 de prueba y añade tus tareas reales debajo.
4. Abre Claude Code en esa carpeta y escribe: *"Usa la skill turno-de-noche"*.
   Mira cómo trabaja la primera vez y lee el informe.
5. Si te convence, crea la rutina diaria con el texto de `RUTINA.md`.

Requisitos: Claude Code (web, escritorio o terminal). Para la rutina diaria, un plan de Claude
que incluya rutinas (compruébalo en tu plan).
Para el control automático, un repositorio en GitHub. Para el comprobador, Python 3, nada más.

## Comprobar que los límites funcionan
Antes de dejarlo trabajar solo, haz esta prueba en Claude Code: crea un archivo cualquiera en
`publicado/` y pídele que lo edite con su herramienta de edición. Debe negarse con el mensaje
"denied by your permission settings". Con `/permissions` ves las reglas que están activas.

**Lo que cubren y lo que no:** estas reglas frenan las herramientas de Claude para leer y
editar archivos (comprobado: tanto editar en `publicado/` como leer `.env` se rechazan). **No
frenan la consola:** un agente con Bash podría leer o escribir con un comando, y lo mismo un
script que ejecute. En nuestras pruebas el agente se negó a usar ese atajo, pero eso es su
criterio, no una barrera. Por eso:
- Las claves de verdad no deben estar en la carpeta: usa secretos de GitHub o variables de entorno.
- Guarda lo aprobado también fuera del alcance del equipo (otra rama protegida, otra carpeta).
- Si quieres más dureza, quita Bash al revisor y al constructor y dales solo los comandos exactos que necesiten.

**Para que el control de GitHub bloquee de verdad:** en tu repositorio, protege la rama
principal (*Settings → Branches*) y marca como obligatoria la comprobación `comprobar` (es el
nombre con el que GitHub muestra el trabajo del flujo "Comprobar tareas").
Sin eso, el control solo avisa con una marca roja.

## Lo que no hace
- No es magia: el equipo es tan bueno como las tareas que le describas.
- No tiene permisos que tú no le des. Los límites de verdad son los de tus cuentas y tu
  repositorio (ramas protegidas, secretos, permisos), no las frases del prompt.
- Cada ejecución consume uso de tu plan de Claude.

## Qué se ha probado
- Un turno completo en una sesión limpia de Claude Code: el constructor hizo una tarea de prueba,
  el revisor la repitió y dio PASA, el informador redactó el informe y quedó un commit con el
  registro de tareas y la memoria actualizados (con fecha y caducidad).
- El bloqueo de editar `publicado/` y el de leer `.env` con las herramientas de Claude. Las otras
  reglas de `.claude/settings.json` (`secretos/` y el propio archivo de ajustes) están configuradas
  igual, pero no se han probado una a una.
- El comprobador de tareas con casos correctos y con errores provocados.

**Aún no probado:** el turno como rutina programada durante varios días, una tarea que acabe
BLOQUEADA y el paso de `git push` con un repositorio remoto.

## Origen
Montado para un proyecto real, aplicando ideas de varios artículos sobre agentes autónomos:
verificación independiente, estado fuera de la conversación, memoria con fecha, reglas de
parada y modo sombra antes de dar permisos.

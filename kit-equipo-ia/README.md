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
| Comprobador en código | `herramientas/comprobar_tareas.py` | Tareas "hechas" sin pruebas ni revisión |
| Control en GitHub | `.github/workflows/` | Que alguien se salte el comprobador |
| La rutina para pegar | `RUTINA.md` | Tener que pedirle cada día que trabaje |

## El equipo
- **Coordinador** (la sesión principal): reparte, sigue el estado, no se cree nada sin pruebas.
- **Investigador**: averigua antes de construir. No puede modificar archivos.
- **Constructor**: hace el trabajo y guarda las pruebas.
- **Revisor**: comprueba el trabajo real y dictamina PASA, FALLA o BLOQUEADA. No puede modificar nada.
- **Informador**: escribe el informe de la mañana: Hecho / Verificado / Falló o bloqueado / Necesito de ti.

## Ponerlo en marcha (unos 15 minutos)
1. Copia esta carpeta en un repositorio tuyo de GitHub, o en la carpeta de tu proyecto.
2. Abre `CLAUDE.md` y escribe en "Qué es este proyecto" lo que quieres que haga tu equipo.
3. En `TAREAS.md`, deja la tarea T01 de prueba y añade tus tareas reales debajo.
4. Abre Claude Code en esa carpeta y escribe: *"Usa la skill turno-de-noche"*.
   Mira cómo trabaja la primera vez y lee el informe.
5. Si te convence, crea la rutina diaria con el texto de `RUTINA.md`.

Requisitos: Claude Code (web, escritorio o terminal) y un plan de Claude que permita rutinas.
Para el control automático, un repositorio en GitHub. Para el comprobador, Python 3, nada más.

## Lo que no hace
- No es magia: el equipo es tan bueno como las tareas que le describas.
- No tiene permisos que tú no le des. Los límites de verdad son los de tus cuentas y tu
  repositorio (ramas protegidas, secretos, permisos), no las frases del prompt.
- Cada ejecución consume uso de tu plan de Claude.

## Origen
Montado y probado en un proyecto real, aplicando las ideas de varios artículos sobre agentes
autónomos: verificación independiente, estado fuera de la conversación, memoria con fecha,
reglas de parada y modo sombra antes de dar permisos.

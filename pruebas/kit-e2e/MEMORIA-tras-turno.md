# Memoria del equipo

Un agente que lo recuerda todo puede decidir con la verdad de ayer. Por eso cada recuerdo
lleva su tipo, su fuente, su fecha y cuándo hay que revisarlo.

- **regla**: permanente hasta que el dueño la cambie. Ejemplo: "publicar exige aprobación".
- **decisión**: tomada en una fecha, por un motivo. Puede revisarse.
- **observación**: algo que se vio en un momento. Caduca.

Si algo nuevo contradice un recuerdo, añade el nuevo y marca el viejo con
`SUPERADA por <fecha>`. No borres nada en silencio.

## Formato
```
- [tipo] Texto
  fuente: de dónde sale · fecha: AAAA-MM-DD · revisar: cuándo o "nunca"
```

## Reglas
- [regla] Publicar, enviar mensajes, pagar, borrar datos o tocar claves exige aprobación del dueño.
  fuente: CLAUDE.md · fecha: 2026-10-23 · revisar: nunca

## Decisiones
- [decisión] Este proyecto no tiene remoto git: los turnos hacen solo commit local, sin push ni `git push --dry-run`.
  fuente: instrucción del usuario · fecha: 2026-10-23 · revisar: cuando se añada un remoto

## Observaciones
- [observación] Los 5 archivos más grandes eran herramientas/comprobar_tareas.py (4201 B), README.md, CLAUDE.md, .claude/skills/turno-de-noche/SKILL.md y RUTINA.md (1318 B).
  fuente: trabajo/T01-archivos.md, verificado por el revisor · fecha: 2026-10-23 · revisar: caduca al cambiar el proyecto

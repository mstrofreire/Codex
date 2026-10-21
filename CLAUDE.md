# Reglas del proyecto

Claude lee este archivo al empezar cada sesión en este repositorio.

## Qué es este proyecto
Un agente (Claude) que trabaja para mstrofreire, residente en España, en dos frentes:
1. **El Filtro**: cuenta de X y publicación en español que lee enteros los posts virales
   sobre IA y dinero y los clasifica en oro, útil o cebo. Reglas en `x/REGLAS.md`.
2. **Agente de inversión**: en laboratorio, con 1.500 € y reglas fijas en `CONSTITUCION.md`.

## Antes de trabajar, lee
- `CONOCIMIENTO.md`: lo aprendido de fuentes externas y cómo se aplica.
- `BITACORA.md`: hoja de ruta y qué se hizo en cada sesión.
- `x/REGLAS.md` y `x/ESTILO.md` si vas a escribir para X.

## Reglas de trabajo
- No inventes datos ni resultados: todo número sale de una herramienta, una fuente o una prueba real.
- Guarda cada decisión importante en `BITACORA.md` con fecha y motivo.
- Commit y push a la rama `claude/kronos-repo-9qxm1t` al terminar cada bloque de trabajo.
- Nunca guardes claves en el repositorio: van en los secretos de GitHub.
- Escribe para el dueño en español claro, sin jerga sin explicar.
- Para analizar posts de X usa la skill `el-filtro` (`.claude/skills/el-filtro/SKILL.md`).

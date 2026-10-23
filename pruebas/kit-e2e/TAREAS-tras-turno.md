# Tareas

## Estados (cada cambio exige una prueba)
- **PENDIENTE**: no empezada.
- **EN_CURSO**: alguien trabaja en ella. Debe tener SIGUIENTE.
- **VERIFICANDO**: hay resultado; falta que el `revisor` lo mire. Debe tener SIGUIENTE.
- **HECHA**: con VERIFICADO (las pruebas) y REVISIÓN: PASA.
- **BLOQUEADA**: dice qué falta y de quién depende.

Una tarea corta puede ir en una sola línea: `T02 · Título · PENDIENTE`.

## Formato de punto de control
```
ID · título
ESTADO:
OBJETIVO:
HECHO:
VERIFICADO:
REVISIÓN:
PENDIENTE:
APROBACIÓN:
SIGUIENTE:
```

---

T01 · Probar el equipo con una tarea pequeña
ESTADO: HECHA
OBJETIVO: que el equipo complete una tarea de principio a fin y deje pruebas. Ejemplo: "lista los 5 archivos más grandes de esta carpeta y guárdala en trabajo/T01-archivos.md".
HECHO: trabajo/T01-archivos.md creado por el constructor con comando y salida (2026-10-23).
VERIFICADO: el revisor repitió el comando de trabajo/T01-archivos.md y la salida coincide con la tabla (5 filas, orden descendente; el 6.º, .claude/agents/constructor.md, pesa 1099 B < 1318 B); publicado/ sin cambios (2026-10-23).
REVISIÓN: PASA
PENDIENTE: nada.
APROBACIÓN: no hace falta.
SIGUIENTE: ninguna.

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
ESTADO: PENDIENTE
OBJETIVO: que el equipo complete una tarea de principio a fin y deje pruebas. Ejemplo: "lista los 5 archivos más grandes de esta carpeta y guárdala en trabajo/T01-archivos.md".
HECHO:
VERIFICADO:
REVISIÓN:
PENDIENTE: todo.
APROBACIÓN: no hace falta.
SIGUIENTE: el coordinador encarga la tarea al constructor y después al revisor.

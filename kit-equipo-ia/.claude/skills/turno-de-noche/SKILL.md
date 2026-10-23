---
name: turno-de-noche
description: Procedimiento del coordinador para una sesión de trabajo autónoma (rutina programada o turno de noche). Úsalo cuando haya que avanzar tareas sin el dueño delante y terminar con un informe.
---

# Turno de noche

1. **Comprueba que el trabajo se podrá guardar.** Si el proyecto está en git, prueba
   `git push --dry-run`. Si falla, no trabajes en balde: ve directo al informe diciendo qué falta.
2. **Lee** `CLAUDE.md`, `TAREAS.md` y `MEMORIA.md`. Revisa si alguna observación de la
   memoria ha caducado frente a la evidencia actual.
3. **Elige como máximo 2 tareas** que no estén HECHAS ni BLOQUEADAS y que se puedan
   avanzar sin el dueño. Pásalas a EN_CURSO con su punto de control.
4. **Para cada tarea:**
   - Si hay dudas sobre qué hacer, encarga primero al `investigador`.
   - Encarga el trabajo al `constructor`.
   - Pasa la tarea a VERIFICANDO y encarga la revisión al `revisor`.
   - Con PASA: HECHA, con las pruebas en VERIFICADO y "PASA" en REVISIÓN.
     Con FALLA: vuelve al constructor una vez. Si falla dos veces con el mismo arreglo: BLOQUEADA.
     Con BLOQUEADA: anota qué falta y de quién depende.
5. **Para** si falta un acceso, si se llega al límite de uso o si algo exige aprobación.
6. **Guarda el estado:** actualiza `TAREAS.md`, añade una entrada a `BITACORA.md`
   y lo que haya que recordar a `MEMORIA.md` con su fecha.
7. Ejecuta `python3 herramientas/comprobar_tareas.py` y corrige lo que señale.
8. Si el proyecto está en git: commit y push.
9. **Termina** encargando el informe al `informador` y devuélvelo tal cual.

Nunca hagas en un turno sin supervisión nada que exija aprobación: déjalo preparado como
borrador y pídelo en "Necesito de ti".

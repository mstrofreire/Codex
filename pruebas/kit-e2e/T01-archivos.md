# T01 · Los 5 archivos más grandes

Fecha: 2026-10-23. Alcance: todos los archivos de la carpeta del proyecto, excluyendo `.git` y este mismo archivo (`trabajo/T01-archivos.md`).

## Comando exacto

```bash
cd /tmp/claude-0/-home-user/a8640ba4-4df9-578b-b987-f1f33e79df47/scratchpad/kit-e2e && find . -path ./.git -prune -o -type f ! -path ./trabajo/T01-archivos.md -printf '%s\t%p\n' | sort -k1,1nr -k2,2 | head -5
```

## Salida real (sin editar)

```
4201	./herramientas/comprobar_tareas.py
3959	./README.md
2601	./CLAUDE.md
1748	./.claude/skills/turno-de-noche/SKILL.md
1318	./RUTINA.md
```

## Tabla

| Ruta | Bytes |
|---|---|
| ./herramientas/comprobar_tareas.py | 4201 |
| ./README.md | 3959 |
| ./CLAUDE.md | 2601 |
| ./.claude/skills/turno-de-noche/SKILL.md | 1748 |
| ./RUTINA.md | 1318 |

## Notas

- Tamaño = bytes del archivo (`%s` de `find -printf`), no uso de disco.
- Orden: bytes descendente, empate por ruta.
- Se incluyen archivos ocultos fuera de `.git` (por ejemplo `.claude/`).

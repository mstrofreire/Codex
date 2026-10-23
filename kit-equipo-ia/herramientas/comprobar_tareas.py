"""Comprueba que TAREAS.md cumple las reglas del equipo.

Un prompt no es una barrera: esta comprobación se puede ejecutar en cada sesión y en
GitHub Actions para que ninguna tarea pase a HECHA sin pruebas ni revisión.

Reglas:
- Cada tarea tiene un identificador único (letras y números, por ejemplo T01) y un estado válido.
- HECHA exige VERIFICADO con contenido y REVISIÓN que empiece por PASA.
- EN_CURSO y VERIFICANDO exigen SIGUIENTE.
- BLOQUEADA exige decir qué falta (en la misma línea del estado o en PENDIENTE).

Uso: python3 herramientas/comprobar_tareas.py [ruta/a/TAREAS.md]
Sale con código 1 si hay errores.
"""
import pathlib
import re
import sys

ESTADOS = {"PENDIENTE", "EN_CURSO", "VERIFICANDO", "HECHA", "BLOQUEADA"}
CAMPOS = {"ESTADO", "OBJETIVO", "HECHO", "VERIFICADO", "REVISIÓN", "REVISION",
          "PENDIENTE", "APROBACIÓN", "APROBACION", "SIGUIENTE"}
CABECERA = re.compile(r"^([A-Z]{1,4}\d{1,4}) · (.+)$")
CAMPO = re.compile(r"^([A-ZÁÉÍÓÚÑ_]+):\s*(.*)$")


def separar_estado(texto):
    """'BLOQUEADA: falta X' -> ('BLOQUEADA', 'falta X')."""
    m = re.match(r"^([A-Z_]+)\b[\s:(—-]*(.*?)\)?$", texto.strip())
    return (m.group(1), m.group(2).strip()) if m else (texto.strip(), "")


def leer_tareas(texto):
    tareas, actual, en_codigo = [], None, False
    for n, linea in enumerate(texto.splitlines(), 1):
        if linea.strip().startswith("```"):
            en_codigo = not en_codigo
            continue
        if en_codigo:
            continue
        cab = CABECERA.match(linea.strip())
        if cab:
            ident, resto = cab.groups()
            partes = [p.strip() for p in resto.split(" · ")]
            actual = {"id": ident, "linea": n, "campos": {}}
            if len(partes) > 1:  # formato de una línea: ID · título · ESTADO
                estado, motivo = separar_estado(partes[-1])
                actual["campos"]["ESTADO"] = partes[-1]
                actual["estado"], actual["motivo"] = estado, motivo
            tareas.append(actual)
            continue
        campo = CAMPO.match(linea.strip())
        if actual and campo and campo.group(1) in CAMPOS:
            clave = campo.group(1).replace("REVISION", "REVISIÓN").replace("APROBACION", "APROBACIÓN")
            actual["campos"][clave] = campo.group(2).strip()
            if clave == "ESTADO":
                actual["estado"], actual["motivo"] = separar_estado(campo.group(2))
    return tareas


def comprobar(tareas):
    errores, vistos = [], set()
    for t in tareas:
        donde = f"{t['id']} (línea {t['linea']})"
        if t["id"] in vistos:
            errores.append(f"{donde}: identificador repetido")
        vistos.add(t["id"])
        estado = t.get("estado")
        c = t["campos"]
        if estado not in ESTADOS:
            errores.append(f"{donde}: estado '{estado}' no válido (usa {', '.join(sorted(ESTADOS))})")
            continue
        if estado == "HECHA":
            if not c.get("VERIFICADO"):
                errores.append(f"{donde}: HECHA sin pruebas en VERIFICADO")
            if not c.get("REVISIÓN", "").upper().startswith("PASA"):
                errores.append(f"{donde}: HECHA sin REVISIÓN: PASA del revisor")
        if estado in ("EN_CURSO", "VERIFICANDO") and not c.get("SIGUIENTE"):
            errores.append(f"{donde}: {estado} sin SIGUIENTE (una sesión nueva no sabría cómo seguir)")
        if estado == "BLOQUEADA" and not (t.get("motivo") or c.get("PENDIENTE")):
            errores.append(f"{donde}: BLOQUEADA sin decir qué falta")
    return errores


def main():
    ruta = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "TAREAS.md")
    tareas = leer_tareas(ruta.read_text(encoding="utf-8"))
    errores = comprobar(tareas)
    resumen = {}
    for t in tareas:
        resumen[t.get("estado")] = resumen.get(t.get("estado"), 0) + 1
    print(f"{ruta}: {len(tareas)} tareas · " + ", ".join(f"{k}: {v}" for k, v in sorted(resumen.items(), key=lambda x: str(x[0]))))
    for e in errores:
        print("ERROR", e)
    print("Todo en orden." if not errores else f"{len(errores)} errores.")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())

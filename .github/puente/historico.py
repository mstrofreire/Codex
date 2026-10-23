"""Fetches the official Infoelectoral Congress files (03, 07, 08) for every general election since 1977.

Runs on a GitHub runner: Infoelectoral drops connections from the cloud session's egress. For each
election it tries the official URL first and then byte-identical copies archived by the Wayback
Machine (current and pre-2020 Ministry domains). Writes the small provincial-level files plus
fuentes.json (URL used, sha256 and size of each original ZIP) next to them.
"""
import hashlib, io, json, socket, sys, time, urllib.request, zipfile
from pathlib import Path

OUT = Path(sys.argv[1])
ELECCIONES = ["197706", "197903", "198210", "198606", "198910", "199306", "199603", "200003", "200403",
              "200803", "201111", "201512", "201606", "201904", "201911", "202307"]
OFICIAL = "https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02{f}_TOTA.zip"
ANTIGUA = "http://www.infoelectoral.mir.es/infoelectoral/docxl/apliextr/02{f}_TOTA.zip"
WAYBACK = "https://web.archive.org/web/{ts}id_/{url}"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36"}
socket.setdefaulttimeout(40)


def get(url, tries=2):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001 - report and try the next source
            err = f"{type(e).__name__}: {e}"
            time.sleep(3 * (i + 1))
    raise RuntimeError(err)


def candidatos(f):
    yield OFICIAL.format(f=f)
    for base in (OFICIAL, ANTIGUA):
        for ts in ("2025", "2023", "2021", "2019"):
            yield WAYBACK.format(ts=ts, url=base.format(f=f))


log, fuentes = [], {}
for f in ELECCIONES:
    for url in candidatos(f):
        try:
            data = get(url)
            z = zipfile.ZipFile(io.BytesIO(data))
        except Exception as e:  # noqa: BLE001
            log.append(f"{f} FALLO {url} -> {str(e)[:160]}")
            continue
        names = z.namelist()
        keep = [n for n in names if Path(n).name[:2] in ("03", "07", "08") or Path(n).name.upper().startswith("FICHEROS")]
        d = OUT / f
        d.mkdir(parents=True, exist_ok=True)
        for n in keep:
            (d / Path(n).name).write_bytes(z.read(n))
        fuentes[f] = {"url": url, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "contenido": names, "extraidos": [Path(n).name for n in keep]}
        log.append(f"{f} OK {url} ({len(data)} B, {len(keep)} ficheros)")
        break
    else:
        log.append(f"{f} SIN FUENTE")
    print(log[-1], flush=True)

OUT.mkdir(parents=True, exist_ok=True)
(OUT / "fuentes.json").write_text(json.dumps(fuentes, indent=1, ensure_ascii=False))
(OUT / "descarga.log").write_text("\n".join(log) + "\n")
print(f"{len(fuentes)}/{len(ELECCIONES)} elecciones descargadas")

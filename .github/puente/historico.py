"""Fetches the official Infoelectoral Congress files (03, 07, 08) for every general election since 1977.

Runs on a GitHub runner: Infoelectoral drops connections from the cloud session's egress. Lists what the
Wayback Machine archived under the current and pre-2020 Ministry download paths (CDX API), then for each
election tries the official URL and those byte-identical archived copies. Writes the small provincial
files plus fuentes.json (URL used, sha256 and size of each original ZIP) and descarga.log.
"""
import hashlib, io, json, sys, time, urllib.parse, urllib.request, zipfile
from pathlib import Path

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
ELECCIONES = ["197706", "197903", "198210", "198606", "198910", "199306", "199603", "200003", "200403",
              "200803", "201111", "201512", "201606", "201904", "201911", "202307"]
OFICIAL = "https://infoelectoral.interior.gob.es/estaticos/docxl/apliextr/02{f}_TOTA.zip"
PREFIJOS = ["infoelectoral.interior.gob.es/estaticos/docxl/apliextr/", "www.infoelectoral.mir.es/infoelectoral/docxl/apliextr/",
            "infoelectoral.mir.es/infoelectoral/docxl/apliextr/", "www.infoelectoral.mir.es/infoelectoral/docxl/"]
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36"}
log = []


def say(msg):
    log.append(msg)
    print(msg, flush=True)
    (OUT / "descarga.log").write_text("\n".join(log) + "\n")


def get(url, timeout=25):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


# 1) What did the Wayback Machine archive?
archivados = {}
for pre in PREFIJOS:
    q = "https://web.archive.org/cdx/search/cdx?" + urllib.parse.urlencode({"url": pre + "02*", "output": "json", "filter": "statuscode:200", "collapse": "urlkey", "limit": "5000"})
    try:
        rows = json.loads(get(q, 60) or b"[]")
        say(f"CDX {pre}: {max(len(rows) - 1, 0)} URLs")
        for ts, orig in ((r[1], r[2]) for r in rows[1:]):
            name = orig.rsplit("/", 1)[-1]
            if name.endswith("_TOTA.zip") or name.endswith("_MUNI.zip"):
                archivados.setdefault(name, []).append((ts, orig))
    except Exception as e:  # noqa: BLE001
        say(f"CDX {pre}: error {type(e).__name__}: {e}")
(OUT / "wayback_cdx.json").write_text(json.dumps(archivados, indent=1))

# 2) Download each election: official first, then archived copies (id_ = original bytes).
fuentes = {}
for f in ELECCIONES:
    cands = [OFICIAL.format(f=f)] + [f"https://web.archive.org/web/{ts}id_/{orig}" for ts, orig in archivados.get(f"02{f}_TOTA.zip", [])]
    for url in cands:
        try:
            data = get(url, 25 if "interior.gob.es" in url and "archive.org" not in url else 180)
            z = zipfile.ZipFile(io.BytesIO(data))
        except Exception as e:  # noqa: BLE001
            say(f"{f} FALLO {url} -> {type(e).__name__}: {str(e)[:120]}")
            continue
        names = z.namelist()
        keep = [n for n in names if Path(n).name[:2] in ("03", "07", "08") or Path(n).name.upper().startswith("FICHEROS")]
        d = OUT / f
        d.mkdir(parents=True, exist_ok=True)
        for n in keep:
            (d / Path(n).name).write_bytes(z.read(n))
        fuentes[f] = {"url": url, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data), "contenido": names, "extraidos": [Path(n).name for n in keep]}
        say(f"{f} OK {url} ({len(data)} B, {len(keep)} ficheros)")
        break
    else:
        say(f"{f} SIN FUENTE ({len(cands)} intentos)")
    (OUT / "fuentes.json").write_text(json.dumps(fuentes, indent=1, ensure_ascii=False))
say(f"{len(fuentes)}/{len(ELECCIONES)} elecciones descargadas")

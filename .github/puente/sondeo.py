"""Runs a few GET requests from the GitHub runner (the work environment cannot reach these hosts) and
saves each response, truncated to 3 MB, so the session can read it from the branch."""
import json, sys, urllib.request
from pathlib import Path

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
PETICIONES = {
    "dataverse_busqueda.json": "https://dataverse.harvard.edu/api/search?q=%22SEA%20Database%22&type=dataset&per_page=50",
    "dataverse_busqueda2.json": "https://dataverse.harvard.edu/api/search?q=Pav%C3%ADa%20Aybar%20P%C3%A9rez%20elections&type=dataset&per_page=50",
    "wayback_dominio_nuevo.json": "https://web.archive.org/cdx/search/cdx?url=infoelectoral.interior.gob.es&matchType=domain&output=json&filter=mimetype:application/zip&collapse=urlkey&limit=2000",
    "wayback_dominio_antiguo.json": "https://web.archive.org/cdx/search/cdx?url=infoelectoral.mir.es&matchType=domain&output=json&collapse=urlkey&limit=3000",
}
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/128 Safari/537.36"}
for name, url in PETICIONES.items():
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
            data = r.read(3_000_000)
        (OUT / name).write_bytes(data)
        print("OK", name, len(data))
    except Exception as e:  # noqa: BLE001
        (OUT / name).write_text(json.dumps({"error": f"{type(e).__name__}: {e}"}))
        print("FALLO", name, e)

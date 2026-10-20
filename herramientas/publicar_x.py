"""Publica en X los borradores aprobados de x/cola/.

Cada borrador es un archivo .md con una cabecera y uno o varios posts separados
por una línea que contiene solo `---` (varios posts = hilo):

    aprobado: si
    publicar_desde: 2026-10-22T09:00
    ===
    Texto del primer post
    ---
    Texto del segundo post (respuesta al primero)

Solo se publica si `aprobado: si` y la fecha (hora de Madrid) ya pasó. Tras publicar,
el archivo pasa a x/publicados/ con los ids de los posts. Las claves se leen de
variables de entorno (secretos de GitHub) y nunca se escriben en disco.

Uso: python3 herramientas/publicar_x.py [--simular]
"""
import base64
import datetime as dt
import hashlib
import hmac
import json
import os
import pathlib
import secrets
import sys
import time
import urllib.parse
import urllib.request
from zoneinfo import ZoneInfo

API = "https://api.x.com/2/tweets"
RAIZ = pathlib.Path(__file__).resolve().parent.parent
COLA = RAIZ / "x" / "cola"
PUBLICADOS = RAIZ / "x" / "publicados"
MAX_POSTS_POR_EJECUCION = 6  # tope de seguridad de gasto
MAX_CARACTERES = 280
MADRID = ZoneInfo("Europe/Madrid")


def _pct(s):
    return urllib.parse.quote(str(s), safe="~-._")


def firma_oauth1(metodo, url, params, consumer_secret, token_secret):
    """Firma HMAC-SHA1 de OAuth 1.0a (RFC 5849)."""
    pares = sorted((_pct(k), _pct(v)) for k, v in params.items())
    cadena_params = "&".join(f"{k}={v}" for k, v in pares)
    base = "&".join([metodo.upper(), _pct(url), _pct(cadena_params)])
    clave = f"{_pct(consumer_secret)}&{_pct(token_secret)}"
    digest = hmac.new(clave.encode(), base.encode(), hashlib.sha1).digest()
    return base64.b64encode(digest).decode()


def cabecera_oauth(metodo, url, cred, nonce=None, timestamp=None, extra_params=None):
    oauth = {
        "oauth_consumer_key": cred["api_key"],
        "oauth_nonce": nonce or secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(timestamp or int(time.time())),
        "oauth_token": cred["access_token"],
        "oauth_version": "1.0",
    }
    a_firmar = dict(oauth, **(extra_params or {}))
    oauth["oauth_signature"] = firma_oauth1(metodo, url, a_firmar, cred["api_secret"], cred["access_secret"])
    return "OAuth " + ", ".join(f'{_pct(k)}="{_pct(v)}"' for k, v in sorted(oauth.items()))


def leer_borrador(ruta):
    texto = ruta.read_text(encoding="utf-8")
    cabecera, _, cuerpo = texto.partition("\n===\n")
    meta = {}
    for linea in cabecera.splitlines():
        if ":" in linea:
            k, v = linea.split(":", 1)
            meta[k.strip()] = v.strip()
    posts = [p.strip() for p in cuerpo.split("\n---\n") if p.strip()]
    return meta, posts


def listo_para_publicar(meta, ahora):
    if meta.get("aprobado", "").lower() not in ("si", "sí"):
        return False
    desde = meta.get("publicar_desde")
    if not desde:
        return True
    return dt.datetime.fromisoformat(desde).replace(tzinfo=MADRID) <= ahora


def validar(posts):
    errores = []
    for i, p in enumerate(posts, 1):
        if len(p) > MAX_CARACTERES:
            errores.append(f"post {i}: {len(p)} caracteres (máximo {MAX_CARACTERES})")
    return errores


def publicar(texto, cred, responde_a=None):
    cuerpo = {"text": texto}
    if responde_a:
        cuerpo["reply"] = {"in_reply_to_tweet_id": responde_a}
    req = urllib.request.Request(
        API, data=json.dumps(cuerpo).encode(), method="POST",
        headers={"Authorization": cabecera_oauth("POST", API, cred), "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["data"]["id"]


def main():
    simular = "--simular" in sys.argv
    cred = {k: os.environ.get(v, "") for k, v in {
        "api_key": "X_API_KEY", "api_secret": "X_API_SECRET",
        "access_token": "X_ACCESS_TOKEN", "access_secret": "X_ACCESS_SECRET"}.items()}
    if not simular and not all(cred.values()):
        print("Faltan claves de X en el entorno: no se publica nada.")
        return 0

    ahora = dt.datetime.now(MADRID)
    enviados = 0
    for ruta in sorted(COLA.glob("*.md")):
        meta, posts = leer_borrador(ruta)
        if not listo_para_publicar(meta, ahora):
            print(f"{ruta.name}: en espera (aprobado={meta.get('aprobado')}, desde={meta.get('publicar_desde')})")
            continue
        errores = validar(posts)
        if errores:
            print(f"{ruta.name}: no se publica: {'; '.join(errores)}")
            continue
        if enviados + len(posts) > MAX_POSTS_POR_EJECUCION:
            print(f"{ruta.name}: se deja para la próxima ejecución (tope de {MAX_POSTS_POR_EJECUCION} posts)")
            continue
        ids, anterior = [], None
        for p in posts:
            if simular:
                anterior = f"simulado-{len(ids) + 1}"
            else:
                anterior = publicar(p, cred, responde_a=anterior)
                time.sleep(2)
            ids.append(anterior)
        enviados += len(posts)
        if simular:
            print(f"{ruta.name}: se publicaría como hilo de {len(posts)} posts")
            continue
        destino = PUBLICADOS / ruta.name
        destino.write_text(ruta.read_text(encoding="utf-8") + f"\n\n<!-- publicado {ahora.isoformat()} ids: {','.join(ids)} -->\n", encoding="utf-8")
        ruta.unlink()
        print(f"{ruta.name}: publicado ({len(ids)} posts) → https://x.com/i/status/{ids[0]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

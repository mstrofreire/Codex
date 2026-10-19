# Kit 29-N por provincia + radar Grok

Dos piezas que trabajan juntas:

- **Kit** (`render.mjs`): 4 tarjetas 1080×1350 y sus textos para cualquiera de las 52 circunscripciones, con la marca que quieras en la esquina. Todas las cifras salen de datos oficiales (`src/voto/congreso2023/provincias.json`).
- **Radar** (`radar.mjs`): Grok busca en X de qué se habla del 29-N en una provincia (o en toda España), elige qué tarjeta lo responde y propone un texto. El script solo deja pasar ese texto si **cada cifra está en los datos oficiales**; si no, usa la plantilla.

## Kit

```bash
npm ci
node kit/render.mjs girona soria                 # por nombre, slug o código INE
node kit/render.mjs all --marca @diariolocal     # las 52 (unos 2 min), con la marca del cliente
node kit/render.mjs 08 --solo Ajustado,Faltan    # solo algunas tarjetas
```

Sale en `out/kit/<provincia>/`:

| Archivo | Qué cuenta |
|---|---|
| `1-escanos.png` | Diputados que elige el 29-N, habitantes por diputado frente a la media y su puesto entre las 52 |
| `2-ajustado.png` | El escaño más barato de dar la vuelta en 2023, con los cocientes D'Hondt (o la barrera del 3 %, o el voto mayoritario en Ceuta y Melilla) |
| `3-faltan.png` | Votos nuevos que le faltaron a cada partido para un diputado más, y a quién se lo habría quitado |
| `4-reparto.png` | Reparto de 2023, participación y % de votos que fue a partidos sin escaño |
| `POSTS.md` | Un texto por tarjeta, listo para revisar y publicar |

Si cambian los datos: `npm run datos` regenera `provincias.json` (Python 3, sin dependencias) y `npm test` comprueba que los 208 textos caben en un post y solo usan cifras oficiales.

## Radar Grok

### Sin API (gratis con tu cuenta de Grok)

```bash
node kit/radar.mjs prompt girona > prompt.txt    # o "all" para toda España
# Pega prompt.txt en Grok (grok.com o la app de X) y guarda su respuesta en respuesta.txt
node kit/radar.mjs ingest respuesta.txt          # valida, filtra cifras y escribe el plan
```

### Con API

```bash
export XAI_API_KEY=...                            # console.x.ai
node kit/radar.mjs run girona                     # radar de una provincia
node kit/radar.mjs run all                        # radar nacional
node kit/radar.mjs run all --dry                  # ver la petición sin enviarla
node kit/radar.mjs medios girona                  # medios locales en X, para contactar uno a uno
```

Usa la Responses API de xAI con la herramienta `x_search` limitada a los últimos 7 días (`--dias N` para cambiarlo) y salida JSON con esquema. Modelo por defecto `grok-4.7`; cámbialo con `XAI_MODEL`. Cada ejecución imprime su coste real (`cost_in_usd_ticks`).

El plan (`kit/radar/<fecha>-<ámbito>.md`, fuera de git) trae por tema: por qué se habla de ello, la duda que se repite, la tarjeta y el comando para renderizarla, el texto aprobado y los enlaces de evidencia marcados:

- `✓` el post aparece entre los que devolvió la búsqueda;
- `⚠` Grok lo citó pero la búsqueda no lo devolvió (puede ser inventado);
- `sin comprobar` en modo manual: ábrelo antes de publicar.

### Filtros que aplica

| Filtro | Qué hace |
|---|---|
| Cifras | Cada número del texto de Grok tiene que estar en los datos oficiales de esa provincia. Si no, se descarta y se usa la plantilla. |
| Evidencias | Solo posts de X; con API, cruzados con las URL que devolvió la búsqueda. |
| Veda | Del 24 al 29 de noviembre bloquea los temas de encuestas (LOREG art. 69.7) y descarta ganchos que las mencionen en cualquier fecha. |
| Formato | JSON validado; los temas mal formados se descartan con el motivo. |

Nada se publica solo: el plan es para que una persona lo revise y publique.

# motion-demo

Vídeo de 20 s (1920×1080, 30 fps) hecho solo con código: React + [Remotion](https://www.remotion.dev), renderizado con Chromium headless y FFmpeg.

```bash
npm install
npm run studio   # editor con previsualización en vivo
npm run render   # exporta out/demo.mp4
```

## Escenas (`src/scenes/`)

| Frames | Escena | Mensaje |
|---|---|---|
| 0–89 | `S1Hook` | "Esto no es un vídeo. Es código." |
| 90–239 | `S2Code` | El código de la izquierda mueve la tarjeta de la derecha en directo |
| 240–404 | `S3Pipeline` | Un agente, cinco departamentos |
| 405–509 | `S4Formats` | Misma historia recompuesta en 16:9, 1:1 y 9:16 |
| 510–599 | `S5Close` | Cierre |

Para cambiar tiempos, colores o textos basta con editar los valores de cada escena o `src/theme.ts` y volver a renderizar.

## "Cuánto pesa tu voto" (`src/voto/`)

Vídeo vertical (1080×1920, 32 s) para las generales del 29-N 2026: habitantes por diputado en cada provincia.

- `seats2026.mjs`: diputados por circunscripción (Real Decreto de convocatoria).
- `ine-cifras-oficiales-2025.txt`: población oficial por provincia (INE, tablas 2854–2909, Padrón a 1-1-2025).
- `compute.mjs` cruza ambos en `data.json`. Comprobado: aplicar el art. 162 de la LOREG a esa población reproduce exactamente el reparto del Real Decreto.

```bash
node src/voto/build-map.mjs                                    # mapa (península + recuadro de Canarias)
node src/voto/compute.mjs src/voto/ine-cifras-oficiales-2025.txt
npx remotion render src/voto/index.ts Voto out/cuanto-pesa-tu-voto.mp4
```

## Kit por provincia y radar Grok (`kit/`)

Cuatro tarjetas por circunscripción (52 × 4) con marca blanca, generadas desde `src/voto/congreso2023/provincias.json` (`provincias.py`: resultados oficiales de 2023, escaños del 29-N y población del INE), y un radar que pide a Grok qué se discute en X para elegir la tarjeta y el texto. Muestras en `out/kit/`. Uso y filtros en [`kit/README.md`](kit/README.md).

```bash
node kit/render.mjs girona --marca @medio   # out/kit/girona/*.png + POSTS.md
node kit/radar.mjs prompt girona            # prompt para pegar en Grok
npm test
```

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

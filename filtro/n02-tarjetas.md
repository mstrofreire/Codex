# El Filtro Nº 2: tarjetas en preparación

## @0xkvro · 11 ago 2026 · Oro
https://x.com/0xkvro/status/2087168304305655957

**Título:** The Quant Guide To Trading Randomness

**Afirma:** el mercado son unas pocas fuerzas comunes más mucho ruido; el trabajo del quant es
restar esas fuerzas (mercado, sector, factores) y buscar ventaja en lo que sobra (el residuo).
"La ventaja no es el modelo, es la máquina de rechazar ideas que hay alrededor."

**Comprobado con datos propios** (494 acciones del Nasdaq, rentabilidades diarias,
11-10-2024 a 16-10-2026, análisis de componentes principales):
- Solo 12 de 494 componentes superan el umbral de ruido aleatorio (Marchenko-Pastur):
  confirma que hay muchas menos apuestas independientes que acciones.
- El primer componente, el "mercado", explica el 18,9 % del movimiento; los 10 primeros, el 40,1 %.
  Correlación media entre pares: 0,17. El artículo exagera al decir que el índice se mueve
  "como una sola criatura": en acciones sueltas, la mayor parte del movimiento es propio de cada una.

**Análisis:** sin anuncio, sin enlace de venta y sin cifras de ganancias. Recoge ideas
estándar y bien documentadas: la regresión del residuo es la base del arbitraje estadístico
(Avellaneda y Lee, 2010). Le falta decir que esa ventaja exige operar en corto, costes muy bajos
e infraestructura, y que se ha erosionado con los años.

**Llévate:** antes de creer que estás diversificado, cuenta tus apuestas independientes,
no tus tickers. Y pregunta a cada resultado cómo de difícil es romperlo, no cómo de bonito se ve.

## Hilo viral sobre TradingAgents · oct 2026 · Útil
Repositorio: https://github.com/TauricResearch/TradingAgents · Paper: https://arxiv.org/abs/2412.20138

**Afirma:** "alguien reemplazó todo el piso de una firma de trading con agentes de IA que
discuten entre sí", 112k estrellas, nº 1 en GitHub, "GRATIS al 100 %".

**Comprobado leyendo el código** (v0.7.0, 16-10-2026):
- El proyecto es real y activo. Agentes: 4 analistas (fundamentales, noticias, sentimiento,
  técnico), investigador alcista y bajista, trader, 3 de riesgo y gestor de cartera.
- **No envía órdenes a ningún bróker**: trabaja con "unidades genéricas". Decide, no opera.
- Sus propios autores dicen que es para investigación y "no es asesoramiento financiero",
  y que el backtest no tiene por qué reproducir ninguna cifra publicada.
- El propio README admite que, al analizar una fecha pasada, las noticias y redes sociales
  "siguen reflejando el ahora": un backtest así puede ver el futuro.
- Y no hay forma de evitar que el modelo (Claude, GPT…) ya "recuerde" lo que pasó en esas fechas.
- Las estrellas no las pude verificar.

**El paper** (v7, junio 2025): 3 meses (enero a marzo de 2024), 3 acciones con resultados,
una sola ejecución, sin deslizamiento. Sharpe de 8,21 en AAPL, una cifra que no se ve
en ningún gestor real. Cada decisión necesitó 11 llamadas al modelo y más de 20 a herramientas.

**"Gratis":** el código sí. Cada decisión cuesta llamadas a la API del modelo.

**Llévate:** la estructura de debate (alcista contra bajista, y un equipo de riesgo que ataca
la decisión) es buena idea para pensar mejor. Lo único que vale como prueba es lo que el
propio hilo dice en su paso 8: semanas de paper trading antes de confiar en una sola llamada.

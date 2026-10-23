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

## @igus_ai · 22 ago 2026 · Cebo
https://x.com/igus_ai/status/2091290223757922789

**Título:** "Los próximos 6-12 meses podrían cambiar tu vida financiera" (1.063 likes)

**Afirma:** primero un techo parabólico en bolsa, luego un rally de cripto y después una recesión;
"un número récord de millonarios". Y: "he acertado todos los techos y suelos del mercado durante
los últimos 15 años, incluido el suelo de Bitcoin en 16.000 $ y el techo en 126.000 $".

**Comprobado con datos** (23-10-2026, dos meses después del post):
- S&P 500: 7.674 → 7.629 (−0,6 %); máximo 7.819 el 6 de octubre. Nasdaq: −0,7 %. Ningún techo parabólico.
- Bitcoin: 77.075 $ el día del post → 81.664 $ (+6 %), entre 74.968 $ y 87.396 $. Ningún rally eufórico.
- Los niveles que cita son reales (mínimo de 15.476 $ en noviembre de 2022 y máximo de 126.200 $ en
  octubre de 2025), pero no enlaza ni una publicación que demuestre que los anticipó.
  Cualquiera puede citar techos y suelos una vez ocurridos.
- La cuenta existe desde 2009 y tiene 160.000 seguidores. Su biografía ofrece un correo de contacto.

**Análisis:** es la plantilla del "profeta": urgencia ("NO PIERDAS EL TIEMPO", "pero no por mucho
tiempo"), una predicción tan amplia que casi cualquier resultado encaja (sube, sube más, luego baja,
en un plazo de 6 a 12 meses), un historial perfecto sin pruebas y una llamada a seguir y activar
notificaciones. El producto es tu atención.

**Llévate:** un pronóstico que no se puede fallar no informa de nada. Pide siempre la fecha,
el nivel y el enlace de la predicción anterior antes de creerte un historial.

## @0xkvro · 23 oct 2026 · Oro
https://x.com/0xkvro/status/2113678227096961252

**Título:** Grok Bot + Claude: How to Build an AI Team That Works While You Sleep

**Afirma:** un equipo de agentes fiable no es un chatbot con más permisos, sino un coordinador,
especialistas, un espacio de trabajo con estado, memoria que sabe olvidar, verificación
independiente y un límite claro de lo que puede hacer sin aprobación.

**Análisis:** no vende nada salvo seguir su cuenta, y es honesto: avisa de que los resultados de
ejemplo son ilustrativos y de que "un prompt no es una barrera de seguridad". La idea más
valiosa es la de la memoria: un agente que lo recuerda todo puede decidir con la verdad de ayer.

**Llévate:** una tarea no está hecha porque un agente lo diga; está hecha cuando hay un recibo
(el cambio, el resultado del test, la revisión). Y a cada recuerdo, ponle fecha.

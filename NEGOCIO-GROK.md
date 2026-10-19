# Grok + este entorno: qué montar para ganar dinero

Investigación y plan · 19 de octubre de 2026 · quedan 41 días para el 29-N

## La recomendación, en corto

1. **Vende «kits de datos del 29-N» por provincia a medios locales y creadores** (B2B). No dependas de lo que paga X: es poco, tarda meses y no paga el contenido automatizado.
2. **Grok hace de radar, este entorno de fábrica.** Lo único que Grok tiene y nadie más es acceso nativo a la conversación de X en tiempo real: lo usamos para saber de qué se habla en cada provincia. Las cifras nunca salen de Grok: salen de datos oficiales calculados aquí, y un filtro descarta cualquier texto suyo con un número que no esté en esos datos.
3. **Ya funciona**: 4 tarjetas × 52 provincias con la marca del cliente (208 tarjetas en menos de 2 minutos), textos para cada una y el radar de Grok por API o copiando y pegando en grok.com.
4. **Después del 29-N el negocio sigue**: municipales y autonómicas del **23 de mayo de 2027** en todos los ayuntamientos y en 10 comunidades más Ceuta y Melilla. Es el mismo producto con muchos más clientes posibles.

## Qué ofrece Grok hoy (octubre de 2026)

xAI pertenece a SpaceX desde febrero de 2026; la API sigue en `api.x.ai` con la consola en console.x.ai.

| Pieza | Qué es | Precio publicado | Para qué la usamos |
|---|---|---|---|
| `grok-4.7` | Modelo principal, 500.000 tokens de contexto | 2 $ / 6 $ por millón de tokens de entrada / salida (el doble por encima de 200.000) | Leer posts y proponer temas y ganchos |
| `grok-4.3`, `grok-4.20` | Gama media | 1,25 $ / 2,50 $ por millón | Alternativa barata (`XAI_MODEL`) |
| **X Search** | Herramienta de servidor: busca posts, perfiles e hilos de X con filtro de fechas y cuentas | 5 $ por 1.000 posts y 10 $ por 1.000 perfiles leídos | **El radar.** Es la ventaja real de Grok |
| Web Search | Búsqueda web | 5 $ por 1.000 llamadas | No hace falta de momento |
| Grok Imagine | Imagen y vídeo generados | Imagen desde 0,02 $; vídeo en torno a 0,05–0,07 $/s según la fuente | No lo usamos: ver «descartado» |

Créditos gratis: las fuentes se contradicen. Varias hablan de 25 $ al registrarse y otra dice que dejaron de darse en abril de 2026; el programa de 150 $/mes exige compartir tus datos con xAI para entrenar. Compruébalo en la consola antes de contar con ellos.

**Coste del radar** (estimado con esos precios): una pasada nacional lee unos 50–100 posts → 0,30–0,60 $; una provincia, unos 0,10–0,25 $. Una pasada nacional diaria hasta el 29-N sale por unos 12–25 $. El script imprime el coste real de cada ejecución.

## Opciones que he evaluado

| Opción | Ingreso realista | Tiempo hasta el primer euro | Veredicto |
|---|---|---|---|
| **Kits de datos para medios locales y creadores** | Cientos a pocos miles de € antes del 29-N si se vende bien | Días | ✅ **La principal** |
| Cuenta propia en X cobrando de X | Bajo e incierto | Meses | ✅ Solo como escaparate |
| Bot que publica solo | Nulo | — | ❌ |
| Canal de vídeos IA «sin cara» con Grok Imagine | Bajo | Meses | ❌ |
| Vender piezas a partidos o candidatos | Medio | Semanas | ❌ por ahora |
| Bot de trading o apuestas con el «sentimiento» de X | Negativo probable | — | ❌ |

Por qué:

- **Cobrar de X.** El 7 de septiembre de 2026 X cerró el reparto de ingresos y lo sustituyó por *Original Content Rewards*: hace falta Premium, 500 seguidores verificados y 500.000 impresiones en 90 días, y según la cobertura del cambio el contenido creado o publicado de forma automatizada no cobra. Sirve para darte a conocer, no para vivir de ello en seis semanas.
- **Bot que publica solo.** X exige la etiqueta de cuenta automatizada, ese contenido no cobra y, desde el 2 de agosto de 2026, el Reglamento europeo de IA (art. 50) obliga a etiquetar el texto generado por IA sobre asuntos de interés público, salvo que una persona lo revise y asuma la responsabilidad editorial. En plena campaña, un error de un bot te quema la marca.
- **Vídeos IA.** Mercado saturado; YouTube no monetiza el contenido en serie o de plantilla, y un *deepfake* de un candidato es un riesgo legal y reputacional que no compensa.
- **Partidos.** Es publicidad política: el Reglamento (UE) 2024/900 se aplica desde el 10 de octubre de 2025 (etiquetas, quién paga, cuánto, segmentación), y Meta y Google ya no admiten anuncios políticos en la UE. No es imposible, pero no es para empezar.
- **Trading.** Es especular, no un negocio. Además hay estafas con la marca Grok (tokens falsos) y en mayo de 2026 se publicó un caso en el que manipularon a Grok para vaciar unos 200.000 $ de un bot de trading conectado a él.

## El producto: «Kit 29-N» (ya hecho)

Por provincia, 4 tarjetas 1080×1350 con la marca del cliente y un `POSTS.md` con un texto por tarjeta:

| Tarjeta | Ejemplo real (Girona) |
|---|---|
| Escaños del 29-N y habitantes por diputado frente a las 52 | Girona elige 6 diputados; cada uno representa a 138.671 habitantes (media: 140.327) |
| El escaño más ajustado de 2023, con los cocientes D'Hondt | Al PP le faltaron 285 votos para quitarle un diputado a Junts |
| Votos que le faltaron a cada partido para un diputado más | El PP, 285; el PSC, 1.429; Vox, 8.920… |
| Reparto de 2023, participación y votos sin escaño | 59,9 % de participación; el 24,9 % de los votos válidos fue a partidos sin escaño |

Muestras: [Girona](motion-demo/out/kit/girona/), [Barcelona](motion-demo/out/kit/barcelona/) (el caso de la barrera del 3 %: a la CUP le faltaron 13.153 votos), [Madrid](motion-demo/out/kit/madrid/) (gana un escaño) y [Ceuta](motion-demo/out/kit/ceuta/) (escaño único).

Argumento de venta, sacado de los datos: **en 9 de las 52 circunscripciones un diputado se decidió por menos de 2.000 votos en 2023, y en 17 por menos de 5.000.** Cada medio local quiere contar el suyo.

Rigor, que es lo que se vende:

- Reparto D'Hondt exacto, validado contra los 350 escaños oficiales de 2023.
- Corregí un error que arrastraban tus piezas: cuatro provincias daban por ganado un empate que la ley resuelve por sorteo. El cálculo de PSOE + Sumar pasa de 137.136 a 137.138 votos; ya están corregidos la tarjeta, su texto y el vídeo `tu-voto-cuenta.mp4`.
- Cada texto se comprueba automáticamente: los 208 caben en un post y no contienen ninguna cifra que no esté en los datos oficiales.

## Cómo encajan Grok y este entorno

```
Grok + X Search (últimos 7 días)
  → temas: de qué se habla, la duda que se repite, qué tarjeta lo responde, un gancho y los posts de evidencia (JSON)
kit/radar.mjs
  → valida el JSON · cada cifra del gancho ∈ datos oficiales · enlaces = posts que devolvió la búsqueda · veda de encuestas
este entorno
  → renderiza la tarjeta (Remotion) y escribe el plan del día (.md)
tú
  → revisas, publicas en tu cuenta o lo entregas al cliente
```

Dos modos:

- **Manual, sin coste extra**: `node kit/radar.mjs prompt girona`, pegas el texto en grok.com o en la app de X y luego `node kit/radar.mjs ingest respuesta.txt`.
- **API**: `XAI_API_KEY` y `node kit/radar.mjs run all`. Incluye `medios <provincia>` para sacar los medios locales con cuenta en X a los que ofrecer el kit.

## Plan hasta el 29-N

| Cuándo | Qué |
|---|---|
| Esta semana (19–25 oct) | Pon tu nombre o marca en lugar de `@tucuenta`. Publica en tu cuenta los kits de 3 provincias como escaparate. Lista de 30 medios locales (`radar medios`). Contacta con 10 al día, uno a uno. |
| 26 oct | Fin del plazo de candidaturas. Cuando se proclamen, una tarjeta nueva: quién se presenta en tu provincia. |
| 26 oct – 12 nov | Cerrar los primeros clientes; radar diario; ajustar las tarjetas a lo que pidan. |
| 13 – 27 nov | Campaña electoral: pico de demanda. |
| 24 – 29 nov | Veda de encuestas (LOREG art. 69.7): el radar bloquea esos temas. |
| 29 nov, noche | Producto premium por construir: tarjetas automáticas con los resultados provisionales de cada provincia en minutos. |
| Diciembre → mayo | Análisis post-electoral y preparación de las municipales del 23-M. |

## Precios para empezar (hipótesis, no datos)

No encontré tarifas públicas fiables de gráficos para prensa en España, así que esto es un punto de partida para probar:

| Cliente | Propuesta | Precio de salida |
|---|---|---|
| Blog o creador local | Kit de su provincia con su marca | 49–99 € |
| Diario digital provincial | Kit + actualizaciones durante la campaña | 150–300 € |
| Lo mismo + noche electoral | Tarjetas con resultados en minutos | +300–600 € |
| Grupo de prensa con varias provincias | Todas sus provincias | 1.500–5.000 € |

Regla: si 3 de los primeros 10 dicen «caro», bajas; si nadie lo dice, subes.

## Reglas que no hay que saltarse

| Norma | Qué implica | Cómo lo cubre el kit |
|---|---|---|
| Reglamento europeo de IA, art. 50 (desde el 2-ago-2026; multas de hasta 15 M€ o el 3 % de la facturación) | Texto de IA sobre asuntos de interés público: etiquetado, salvo revisión humana con responsabilidad editorial | Una persona revisa y publica; las tarjetas salen de datos oficiales por código, no son contenido sintético |
| Ley española de IA | Proyecto aprobado por el Gobierno el 26-may-2026, en tramitación; prevé etiquetar el contenido generado por IA | Vigilar su aprobación |
| LOREG art. 69.7 | Prohibido publicar encuestas los 5 días anteriores a la votación | Bloqueo automático del 24 al 29 de noviembre |
| Reglamento (UE) 2024/900 | Publicidad política: etiquetas y transparencia | No vender a partidos de momento |
| LSSI art. 21 | Email comercial solo con consentimiento previo, también entre empresas | Contacto uno a uno; nada de envíos masivos |
| Normas de X | Las cuentas automatizadas llevan etiqueta y lo automatizado no cobra | Publicas tú |
| Licencia de Remotion | Gratis para particulares y empresas de hasta 3 empleados | Si creces: licencia de empresa |
| Reutilización de datos públicos (Ley 37/2007) | Citar la fuente | Cada tarjeta cita Interior, INE o el Real Decreto |

## Para activar Grok por API

1. Crea una clave en console.x.ai y carga saldo (empieza con poco).
2. Este entorno no llega a `api.x.ai`: su política de red lo bloquea. O añades `api.x.ai` a los dominios permitidos y la clave como variable `XAI_API_KEY` en la configuración del entorno (menú del entorno en la barra de título de la sesión → Editar; pasos en [la documentación](https://code.claude.com/docs/en/cloud-environments#network-access)), o ejecutas el radar en tu ordenador (Node 22; el radar no necesita instalar nada más).
3. Mientras tanto, el modo manual con grok.com funciona igual.

## Siguientes desarrollos, por orden de dinero

1. **Noche electoral**: adaptador a los resultados provisionales del Ministerio del Interior y re-render en minutos.
2. **Vídeo vertical por provincia** (15–20 s) a partir de las mismas tarjetas.
3. **Candidaturas proclamadas** por provincia.
4. **Municipales 2027**: los mismos datos por municipio.

## Fuentes

- xAI: [modelos y precios](https://docs.x.ai/developers/models), [precios de la API](https://docs.x.ai/developers/pricing), [X Search](https://docs.x.ai/developers/tools/x-search), [citas](https://docs.x.ai/developers/tools/citations), [seguimiento de costes](https://docs.x.ai/developers/cost-tracking), [salidas estructuradas](https://docs.x.ai/developers/model-capabilities/text/structured-outputs), [Grok Imagine Image](https://docs.x.ai/developers/models/grok-imagine-image), [SDK de Python](https://github.com/xai-org/xai-sdk-python)
- Créditos de xAI (contradictorios): [agentdeals.dev](https://agentdeals.dev/vendor/xai), [apideck](https://radar.apideck.com/blog/how-to-get-your-grok-xai-api-key.md), [aicreditmart](https://aicreditmart.com/ai-credits-providers/xai-grok-api-how-to-get-150-month-in-free-credits-2026-guide/)
- Vídeo de Grok Imagine: [DataCamp](https://www.datacamp.com/tutorial/grok-imagine-api), [Unifically](https://unifically.com/blogs/grok-imagine-api-pricing)
- SpaceX y xAI: [mezha.ua](https://mezha.ua/en/news/spacex-xai-merging-308133/)
- X: [Original Content Rewards](https://help.x.com/en/using-x/original-content-rewards), [The Next Web](https://thenextweb.com/news/x-original-content-rewards-program-revenue-sharing-ends), [Pulse](https://www.pulse.ng/story/x-ends-creator-revenue-sharing-nigerian-creators-2026090821154477639), [Usefastlane](https://www.usefastlane.ai/blog/x-original-content-rewards-program), [reglas de automatización](https://help.x.com/en/rules-and-policies/x-automation), [etiqueta de cuentas automatizadas](https://help.x.com/en/using-x/automated-account-labels)
- Elecciones: [BOE, Real Decreto 806/2026](https://www.boe.es/boe/dias/2026/10/06/pdfs/BOE-A-2026-20742.pdf), [Junta Electoral Central](https://www.juntaelectoralcentral.es/cs/jec/eleccionesEnCurso/Elecciones_generales_2026), [Infobae](https://www.infobae.com/espana/2026/10/06/ya-es-oficial-el-boe-publica-el-real-decreto-que-convoca-elecciones-generales-el-29-de-noviembre-y-disuelve-las-cortes/), [La Moncloa](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/interior/Paginas/guia-dudas-elecciones-generales-29n.aspx), [municipales del 23-M de 2027](https://www.diaridetarragona.com/espana/263329/calendario-electoral-pedro-sanchez-incognita-posible-adelanto.html), [veda de encuestas](https://www.legalitas.com/actualidad/cinco-dias-antes-las-elecciones-generales-retuitear-un-sondeo-electoral-puede-ser-delito)
- IA: [art. 50, Baker Botts](https://www.bakerbotts.com/thought-leadership/publications/2026/september/eu-ai-act-article-50-transparency-obligations-go-live), [Faegre Drinker](https://www.faegredrinker.com/en/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations), [Comisión Europea](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations), [ley española de IA](https://www.moncloa.com/2026/05/27/ley-ia-espana-contenidos-identificacion-3380073/)
- Publicidad política: [TTPA](https://en.wikipedia.org/wiki/Transparency_and_targeting_of_political_advertising), [Meta](https://techcrunch.com/2025/07/25/meta-to-stop-selling-political-ads-in-the-eu-from-october), [Google](https://ppc.land/google-restricts-eu-political-ads-to-official-communications-only)
- Plataformas: [YouTube y el contenido inauténtico](https://www.androidheadlines.com/2026/07/youtube-monetization-rules-ai-slop-inauthentic-content.html)
- Email comercial: [Genbeta sobre la AEPD](https://www.genbeta.com/actualidad/que-te-envien-correos-publicidad-que-te-dejen-rechazarlos-puede-salir-caro-a-quien-envia-aepd-multa), [Fieldfisher](https://www.fieldfisher.com/es-es/locations/spain/insights/bases-datos-empresariales)
- Riesgos con la marca Grok: [CriptoNoticias](https://www.criptonoticias.com/comunidad/alerta-rug-pull-400-tokens-ia-grok-musk), [TechStory](https://techstory.in/the-great-ai-heist-how-a-morse-code-trick-drained-200000-from-groks-crypto-wallet/)
- Remotion: [licencia y precios](https://www.remotion.dev/docs/license/pricing)

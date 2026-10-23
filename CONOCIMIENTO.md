# Conocimiento acumulado

Lecciones de fuentes externas y cómo se aplican aquí. El agente lo lee al empezar
cada sesión. Cada fuente se resume por lo que aporta, no por lo que promete.

## El ciclo de trabajo (de @RuOnChain1, "How To Build a Quant Desk", 13-10-2026)
Un fondo no tiene "estrategias", tiene un ciclo que nunca para. Lo adoptamos tal cual:

1. **Observación**: algo llamativo con una razón estructural para existir.
   Un patrón encontrado buscando en datos sin razón detrás se descarta.
2. **Tesis**: afirmación concreta y refutable: "X predice Y, en estas condiciones,
   por esta razón, y debería seguir porque…". Se escribe en `tesis/` antes de probarla.
3. **Prueba de fuego** (*gauntlet*). Diseñada para rechazar:
   - fuera de muestra en periodos separados;
   - solo con los activos más líquidos;
   - cada parámetro movido ±10 %: si el resultado cambia mucho, no hay ventaja, hay un número afortunado;
   - costes un 50 % peores que los previstos;
   - cada intento queda contado en `registro_pruebas.csv` (corrige el "pruebo hasta que sale").
4. **Veredicto**, uno de tres: **VALIDADA** (gana en rentabilidad y riesgo, también en los años
   que no vio), **COMPROMISO** (gana en una cosa y pierde en otra), **SIN VENTAJA** (se archiva).
   Las validadas llevan escritas sus condiciones de invalidación.
5. **Retroalimentación**: cada estrategia en marcha tiene estado **ACTIVA**, **VIGILAR**
   (se reduce tamaño) o **REVISAR** (se reevalúa). Lo aprendido orienta la siguiente observación.

Advertencia del mismo autor: cuanto más rápido se prueban ideas, más falsos positivos salen.
La velocidad sin contar intentos solo produce errores más rápido.
(El artículo promociona QuantGPT, de pago; no lo usamos.)

## Cómo deben funcionar las rutinas (de @gippp69, 11-10-2026)
- El reloj cuesta más que el modelo: una rutina cada 5 min cuesta 12 veces más que cada hora.
  Elegir la frecuencia más lenta que el trabajo aguante.
- Mejor reaccionar a eventos que preguntar cada N minutos.
- Si hace falta frecuencia alta: primero una comprobación barata ("¿ha cambiado algo?"),
  y solo si cambió, el trabajo completo.
- **Decidir de antemano qué pasa a las 3 de la mañana**: o la acción está permitida por regla,
  o se deja como borrador. Nunca "esperar a que el dueño apruebe": las aprobaciones caducan.
- Llevar nuestro propio registro de ejecuciones (las plataformas guardan pocas).
- Cada ejecución debe ponerse al día desde el último éxito registrado, por si se saltó alguna.

Aplicación: rutina diaria (no cada pocos minutos); la ejecución de órdenes, cuando llegue,
corre en código con reglas fijas, sin esperar aprobaciones nocturnas; `registro_ejecuciones.csv`.

## Agentes autónomos (de @0x_rody, 20-10-2026, y @Beaver_0x, 20-10-2026)
- Antes de dejar actuar a un agente: **una semana en modo sombra** (decide, no ejecuta)
  y leer los desacuerdos.
- Botón de apagado siempre; seguir registrando después de activar.
- El dueño conserva la última palabra en lo irreversible.
- Memoria explícita: cada decisión, persona y proyecto se guarda en archivos que el agente relee.
- Descartado: instalar "guardianes" de terceros que ven todas las acciones del agente
  (jev-guard y similares): son un riesgo de cadena de suministro para un sistema con dinero.

## Estructura de mercado como fuente de ventaja (de @RetroValix, Polymarket, 24-08-2026)
Los bots más rentables de Polymarket no predicen el precio: explotan la estructura.
- Comprar "Sube" y "Baja" en momentos distintos hasta que el par cuesta menos de 1 $:
  la parte emparejada gana pase lo que pase.
- Recalcular la probabilidad justa más rápido que el mercado tras un movimiento del activo.
- Calidad de ejecución: órdenes pasivas a precios propios en vez de pagar el precio de venta.
Lección general: buscar ventajas **estructurales** (de ejecución o de diseño del mercado),
no de predicción. Pendiente de investigar: legalidad y acceso desde España, competencia
y capital necesario. Es una observación, no una tesis.

## Funciones de Claude que aprovechamos (de @angeldot_, 11-10-2026)
Su guía "Claude hace todo esto (y casi nadie lo sabe)" lista 20 funciones. Aplicadas aquí:
- **CLAUDE.md**: reglas que Claude lee siempre → creado en la raíz del repo.
- **Skills**: instrucciones empaquetadas para una tarea repetida → `.claude/skills/el-filtro/`.
- **Tareas programadas**: ya en uso (rutina diaria del agente).
- **Artifacts**: El Filtro Nº 1 publicado como página.
- **Abogado del diablo / mentor sin filtro**: se usa antes de cada decisión importante.
- **Conectores** (Gmail, Calendar, Drive) y **Claude en Chrome**: los activa el dueño desde
  su cuenta si quiere que el agente trabaje con su correo o su navegador.
- **Prompt caching**: solo aplica si algún día usamos la API de Claude directamente.
Su formato de escritura (gancho, error común, promesa concreta, bloques numerados con algo
para copiar, honestidad, cierre con una sola acción) está en `x/ESTILO.md`.

## Señal frente a ruido (de @0xkvro, "The Quant Guide To Trading Randomness", 11-08-2026)
- El mercado son pocas fuerzas comunes más ruido. Comprobado: en 494 acciones del Nasdaq
  (oct-2024 a oct-2026) solo 12 componentes superan el umbral de ruido de Marchenko-Pastur;
  el primero explica el 18,9 % y los diez primeros el 40,1 %.
- Aplicación: medir el número de apuestas independientes de cada cartera, no el de activos.
  Se añade a la prueba de fuego: "¿sobrevive si quitas el mejor periodo?" y "¿qué pasa en las colas?".
- El arbitraje estadístico sobre el residuo exige posiciones cortas, que la constitución prohíbe:
  no aplica al agente de inversión, sí como herramienta de diagnóstico.

## TradingAgents (TauricResearch), revisado el 22-10-2026
- Código leído (v0.7.0): 12 agentes que debaten; no ejecuta órdenes; avisa de que es para investigación.
- Problemas para evaluarlo con el pasado: el README admite que noticias y redes reflejan "el ahora"
  en fechas históricas, y el modelo recuerda lo que pasó. El paper usa 3 meses de 2024 y una sola ejecución.
- Uso posible aquí: solo como un jugador más del modo sombra, evaluado hacia delante, y si el coste
  de API cabe en el presupuesto. Ya adoptamos su idea del debate alcista/bajista.

## Equipo de agentes que trabaja de noche (de @0xkvro, 23-10-2026)
- Un coordinador que es dueño del resultado, especialistas con trabajos distintos
  (investigar, construir, revisar, informar) y trabajo que deja **pruebas**, no promesas.
- El estado vive fuera de la conversación: tareas con identificador, un dueño y un punto de
  control (hecho, verificado, pendiente, aprobación, siguiente). Aplicado en `TAREAS.md`.
- Estados con transiciones que exigen pruebas; un revisor independiente devuelve PASA, FALLA o BLOQUEADA.
- Memoria que sabe olvidar: "el test falló el lunes" caduca cuando pasa el miércoles.
  Cada recuerdo lleva tipo, fuente y fecha. Aplicado en `CLAUDE.md`.
- La IA prepara acciones con consecuencias; no recibe permiso automático para ejecutarlas.
  Y un prompt no es una barrera de seguridad: los límites se imponen en los sistemas
  (secretos de GitHub, aprobación de hilos).
- Reglas de parada: falta acceso, no se reproduce el problema, el mismo arreglo falla dos veces.
- El informe de la mañana es el producto: qué se completó, qué se verificó, qué falló, qué necesita decisión.
- El propio autor avisa de que sus ejemplos de resultados son ilustrativos, no de una ejecución real.

## Arnés para tareas largas (de @beamnxw, "Make Opus 5.5 Finish Long Tasks", 06-10-2026)
- Siete capas: hechos estables en CLAUDE.md, procedimientos como skills, conexiones (MCP) solo
  cuando sirven a un paso, **límites en la capa de ejecución** (permisos y hooks, no el prompt),
  revisor que devuelve pruebas, esfuerzo asignado por trabajo y una condición de "terminado"
  definida por entregables.
- Aplicado: `.claude/settings.json` del kit niega leer `.env`/`secretos/` y editar `publicado/`
  (verificado en la documentación oficial de configuración). Un campo de esfuerzo por subagente
  no se pudo confirmar en la documentación: no se usa.
- Límite reconocido por el propio artículo: las reglas de archivos no frenan a un script que el
  agente ejecute por su cuenta; para eso, permisos del sistema y claves fuera de la carpeta.

## Herramientas de código abierto revisadas (lista de @beamnxw, 23-10-2026)
Los 20 repositorios existen (comprobado con git). Valoración para este proyecto:
- **Útiles ya o pronto:** MarkItDown (convierte PDF, Word o web a texto: leer papers en El Filtro),
  DuckDB (análisis SQL rápido sobre CSV: laboratorio de inversión), FastMCP (crear un servidor
  MCP propio, por ejemplo con las herramientas de El Filtro), Worktrunk (varias ramas en paralelo
  para agentes que trabajan a la vez).
- **Para más adelante:** Remotion (vídeos de los hilos con código), React Email (newsletter de
  El Filtro), Nextra o Slidev (web del kit y presentaciones), Stagehand (navegador automatizado).
- **No encajan ahora:** Better-T-Stack, 21st MCP y tweakcn (crear apps y diseño web), Serena
  (código grande), Qdrant MCP (memoria vectorial: nuestros archivos bastan), PGlite, Spotlight,
  Mastra, Trigger.dev y LibreChat (ya cubierto con Claude Code, rutinas y GitHub Actions).
  Agent Orchestrator: sin revisar a fondo.

## Señales de alarma (descartado)
- @EaStEnRaY1: "de 52 $ a 186.000 $ con arbitraje entre exchanges en 36 horas;
  comenta ARB y te lo mando por privado". Patrón típico de cebo o estafa:
  cifra imposible de verificar, urgencia y captación por mensaje privado.
  El arbitraje entre exchanges con 52 $ no cubre comisiones ni retiradas.
- Cualquier fuente que prometa rentabilidades sin pruebas verificables se archiva aquí.
- @igus_ai (22-08-2026, 1.063 likes): plantilla del "profeta". Predijo techo parabólico en bolsa y
  rally de cripto en 6-12 meses y dice haber acertado "todos los techos y suelos en 15 años".
  Dos meses después: S&P 500 −0,6 %, Bitcoin +6 % (77.075 $ → 81.664 $). Historial sin pruebas.

## Fuera de alcance de este proyecto (anotado por si interesa)
- @humzaakhalid, "7 Ways to Make Money With AI": servicios (auditorías de IA, configuración
  de Claude, formación, contenido) y productos. Es otra vía para rentabilizar el capital y
  el tiempo, distinta del trading.
- @Bober_smart, vídeos con IA en 5 fases: idea útil y general. Primero referencias y datos
  verificados, después la obra, y nada se publica sin aprobación.

## Investigación previa (20-10-2026), resumen
- Alpha Arena: la mayoría de IAs perdió dinero real, sobre todo por operar en exceso.
- FINSABER: las ventajas publicadas de la IA se diluyen con más años y más activos;
  la IA es demasiado prudente en mercados alcistas y demasiado agresiva en bajistas.
- Una IA no se puede evaluar con backtests del pasado (lo recuerda): solo hacia delante.
- Kronos: probado y sin ventaja para elegir acciones; fuera del núcleo.
- Con 1.500 €, las comisiones dominan: bróker sin comisiones, pocas operaciones al año.
- Residente en España: ETFs UCITS en euros (los ETFs de EE. UU. están vetados por PRIIPs).

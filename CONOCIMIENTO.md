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

## Señales de alarma (descartado)
- @EaStEnRaY1: "de 52 $ a 186.000 $ con arbitraje entre exchanges en 36 horas;
  comenta ARB y te lo mando por privado". Patrón típico de cebo o estafa:
  cifra imposible de verificar, urgencia y captación por mensaje privado.
  El arbitraje entre exchanges con 52 $ no cubre comisiones ni retiradas.
- Cualquier fuente que prometa rentabilidades sin pruebas verificables se archiva aquí.

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

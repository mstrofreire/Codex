# Memoria del equipo

Un agente que lo recuerda todo puede decidir con la verdad de ayer. Por eso cada recuerdo
lleva su tipo, su fuente, su fecha y cuándo hay que revisarlo.

- **regla**: permanente hasta que el dueño la cambie. Ejemplo: "publicar exige aprobación".
- **decisión**: tomada en una fecha, por un motivo. Puede revisarse.
- **observación**: algo que se vio en un momento. Caduca.

Si algo nuevo contradice un recuerdo, añade el nuevo y marca el viejo con
`SUPERADA por <fecha>`. No borres nada en silencio.

## Formato
```
- [tipo] Texto
  fuente: de dónde sale · fecha: AAAA-MM-DD · revisar: cuándo o "nunca"
```

## Reglas
- [regla] Publicar, enviar mensajes, pagar, borrar datos o tocar claves exige aprobación del dueño.
  fuente: CLAUDE.md · fecha: (pon la fecha de hoy) · revisar: nunca

## Decisiones

## Observaciones

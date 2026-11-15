# Issues de costos

> Estado actualizado: consultar [la verificaci?n real del 15/11/2026](costs-live-integration.md). El detalle siguiente conserva la evidencia hist?rica anterior a esa integraci?n.

Los tres issues fueron publicados en `edwinndev/software-estimation-client` con autorización agrupada del usuario y etiqueta `bug`. La revisión previa de issues abiertos y cerrados encontró únicamente el issue #41 del flujo de trabajo del equipo.

Los tres permanecen abiertos. Las correcciones están registradas en commits locales y los criterios técnicos aislados están comprobados. La validación con la API real y la integración a `develop` continúan pendientes.

## Issue #45

[[Bug][PMGT-143] Los errores de consulta aparecen como proyecto sin costos](https://github.com/edwinndev/software-estimation-client/issues/45)

La reproducción se realizó con código histórico y respuestas HTTP aisladas. La solución y los commits referenciados están en la rama local `feature/frontend-costs-integration`, pendiente de publicación. La API local no estuvo disponible para la prueba real.

### Tipo y relación

Bug de presentación de errores. Jira PMGT-143 y PMGT-145.

### Descripción y contexto

La vista anterior mostraba el mismo estado vacío cuando la consulta fallaba y cuando el proyecto carecía de costos. Un error de permisos, proyecto inexistente, conflicto o servidor podía interpretarse como ausencia de costos.

### Pasos para reproducir

1. Usar `CostsView` del commit `07e3058` en una prueba aislada.
2. Proporcionar al hook una consulta finalizada con `data: undefined`, `isLoading: false`, `isError: true` y error HTTP 403.
3. Renderizar la vista.

### Resultado actual comprobado en la versión afectada

Se presenta «Aún no hay costos calculados». La reproducción contra el código histórico confirmó ese texto en el HTML.

### Resultado esperado

La vista presenta el error correspondiente y permite reintentar. El mensaje de proyecto vacío corresponde a una respuesta válida con listas vacías.

### Causa identificada

La vista utilizaba únicamente `data` e `isLoading`. Cuando faltaban datos elegía `CostsEmptyState`, sin evaluar el estado de error.

### Criterios de aceptación

- [x] Los errores 400, 401, 403, 404, 409 y 500 tienen un estado de error visible.
- [x] El error tiene semántica accesible de alerta.
- [x] El reintento queda deshabilitado mientras se ejecuta la consulta.
- [x] Una respuesta 204 se distingue de un proyecto sin tareas.
- [ ] Se comprueba el comportamiento con una API real y se integra el cambio según el flujo del equipo.

### Solución y evidencia

La corrección está en `d5d44f6`, `fix(PMGT-143): distinguish loading errors and empty cost responses`. La suite preparada en `tests/costs-integration.test.mjs` verifica errores HTTP, consultas fallidas y renderizado de la vista.

Se ejecutó `node --test tests/cost-task-breakdown.test.mjs tests/costs-integration.test.mjs` con 24 pruebas aprobadas en el estado actual de trabajo.

### Vinculación y cierre

La solución está registrada en el commit local `d5d44f6`. El PR hacia `develop` queda pendiente de publicación de la rama. El cierre corresponde cuando se cumplan los criterios y la integración esté verificada.

## Issue #46

[[Bug][PMGT-145] El total muestra PEN cuando la API devuelve moneda nula](https://github.com/edwinndev/software-estimation-client/issues/46)

La reproducción se realizó con código histórico y respuestas HTTP aisladas. La solución y los commits referenciados están en la rama local `feature/frontend-costs-integration`, pendiente de publicación. La API local no estuvo disponible para la prueba real.

### Tipo y relación

Bug de conservación del contrato monetario. Jira PMGT-145 y PMGT-146.

### Descripción y contexto

El endpoint devuelve `total: { amount: 0, currency: null }` para un proyecto sin tareas. El resumen anterior perdía la moneda y la tarjeta usaba siempre el formateador de soles.

### Pasos para reproducir

1. Usar el adaptador y la tarjeta de resumen del commit `7ecf84c`.
2. Adaptar una respuesta con total cero, moneda nula y listas de tareas y perfiles vacías.
3. Renderizar el total del proyecto.

### Resultado actual comprobado en la versión afectada

El adaptador omite la moneda. La tarjeta presenta el símbolo `S/` aun cuando el contrato tiene `currency: null`. Ambas condiciones se confirmaron con el código histórico.

### Resultado esperado

Se conserva la moneda del total y del subtotal por perfil. Con moneda nula se presenta el monto sin asignar un símbolo y se informa que aún no hay una moneda definida.

### Causa identificada

`ProjectCostSummary` y `ProfileCostBreakdown` carecían del campo de moneda. La tarjeta y la tabla usaban `formatCurrency`, configurado de forma fija para PEN.

### Criterios de aceptación

- [x] El adaptador conserva la moneda del total y de los subtotales.
- [x] Un proyecto con moneda nula muestra monto cero y su estado de moneda indefinida.
- [x] Los montos PEN conservan su formato monetario.
- [x] La tarjeta identifica el total como costo base antes de contingencias.
- [ ] Se verifica el caso vacío con la API real y se integra el cambio según el flujo del equipo.

### Solución y evidencia

El commit local `5607b7f`, `fix(PMGT-145): preserve backend currencies and identify project base costs`, conserva la moneda del total y de los subtotales y adapta la tarjeta y la tabla.

Las pruebas `preserves project and profile currencies` y `summary renders the base cost and preserves an undefined project currency` aprueban con la implementación actual.

### Comando de verificación

```bash
node --test tests/cost-task-breakdown.test.mjs tests/costs-integration.test.mjs
```

Resultado, 24 pruebas aprobadas con respuestas aisladas. TypeScript, lint del módulo y build de producción aprobados. El lint general conserva siete advertencias previas en Proyectos. La API real y la integración a `develop` siguen pendientes.

### Vinculación y cierre

La solución está registrada en el commit local `5607b7f`. El PR hacia `develop` queda pendiente de publicación de la rama. El cierre corresponde cuando se cumplan los criterios y la integración esté verificada.

## Issue #47

[[Bug][PMGT-147] Los costos quedan desactualizados al volver de otra ventana](https://github.com/edwinndev/software-estimation-client/issues/47)

La reproducción se realizó con código histórico y respuestas HTTP aisladas. La solución y los commits referenciados están en la rama local `feature/frontend-costs-integration`, pendiente de publicación. La API local no estuvo disponible para la prueba real.

### Tipo y relación

Bug de actualización de caché. Jira PMGT-147.

### Descripción y contexto

Una consulta de costos reciente permanece fresca durante 30 segundos. Si los datos del backend cambian desde otra ventana, volver a la vista dentro de ese intervalo conservaba los costos anteriores hasta otra recarga.

### Pasos para reproducir

1. Usar las opciones de `useProjectCosts` del commit `7ecf84c` con un `QueryClient` y un `QueryObserver` en una prueba aislada.
2. Cargar los costos con una respuesta HTTP de prueba y conservar un observador activo.
3. Simular que la ventana pierde el foco y que hay nuevos datos disponibles en el servidor de prueba.
4. Recuperar el foco antes de que transcurran 30 segundos.
5. Comprobar el número de solicitudes.

### Resultado actual comprobado en la versión afectada

El número de solicitudes no aumenta al recuperar el foco. La reproducción con el hook histórico confirmó que se conserva la consulta reciente.

### Resultado esperado

Al recuperar el foco se consultan los costos actuales. Las invalidaciones de un proyecto afectan su consulta, y la invalidación global permite actualizar proyectos afectados por un cambio de CER.

### Causa identificada

La combinación de `staleTime: 30_000` y `refetchOnWindowFocus: true` solo recarga consultas obsoletas. Los cambios externos al `QueryClient` no invalidaban por sí mismos esa consulta.

### Criterios de aceptación

- [x] Recuperar el foco provoca una consulta aun dentro de los 30 segundos.
- [x] Las solicitudes concurrentes del mismo proyecto comparten la consulta.
- [x] Existe invalidación reutilizable por proyecto y global.
- [x] Los eventos de almacenamiento de otros proyectos no invalidan el proyecto actual.
- [x] El listener se retira al desmontar el hook.
- [x] La actualización manual informa su estado y evita clics repetidos durante la solicitud.
- [ ] Se verifica el flujo completo con guardados reales de horas, CER y responsables y se integra el cambio según el flujo del equipo.

### Solución y evidencia

El commit local `e779439`, `feat(PMGT-147): synchronize project costs across views and window focus`, establece recarga al recuperar el foco, invalidación reutilizable, escucha de almacenamiento y actualización manual.

Las pruebas actuales comprueban recarga por foco, deduplicación, invalidación, retiro del listener y callbacks existentes de horas, perfiles y backlog. También comprueban las respuestas aisladas 450, 500 y 600 tras invalidar.

### Dependencia pendiente

Los servicios de horas ajustadas y CER todavía guardan sus datos localmente. Los cambios deben llegar al backend desde sus módulos para completar la prueba real de PMGT-147.

### Comando de verificación

```bash
node --test tests/cost-task-breakdown.test.mjs tests/costs-integration.test.mjs
```

Resultado, 24 pruebas aprobadas con respuestas aisladas. TypeScript, lint del módulo y build de producción aprobados. El lint general conserva siete advertencias previas en Proyectos. La API real y la integración a `develop` siguen pendientes.

### Vinculación y cierre

La solución está registrada en el commit local `e779439`. El PR hacia `develop` queda pendiente de publicación de la rama. El cierre corresponde cuando se cumplan los criterios, incluida la integración de persistencia necesaria.

## Seguimiento

La publicación de la rama y del Pull Request permitirá completar los vínculos remotos de los commits. Las referencias de cierre deben revisarse después de cumplir los criterios pendientes. El usuario conserva la aprobación de publicación de rama, integración y cierre de issues.

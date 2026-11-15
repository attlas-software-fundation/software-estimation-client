# Integración del módulo de costos

## Alcance y contrato

La vista `/projects/[projectId]/costs` consulta `GET /api/v1/project-costs/{projectId}` mediante `apiClient`. La página resuelve `params` con `await` y entrega el identificador al hook. El backend exige un UUID y el permiso `cost:read`.

El contrato se verificó contra `software-estimation-api`, `develop`, commit `86d61b505a0f4589ddb6556b14eb4c85bcda6c5f`. La copia local del backend permanece en `56d64ed`. La revisión del contrato fue de lectura.

| Campo           | Contenido                                                      |
| --------------- | -------------------------------------------------------------- |
| `projectId`     | Identificador del proyecto                                     |
| `total`         | `amount` y `currency` del costo base consolidado               |
| `tasks`         | Identificador, total y contribuciones por perfil de cada tarea |
| `contributions` | `technicalProfileId`, `hours`, `hourlyRate` y `cost`           |
| `profiles`      | Identificador y `subtotal` por perfil                          |

La moneda disponible es `PEN`. Un proyecto sin tareas devuelve monto cero, moneda `null` y listas vacías. El endpoint entrega identificadores de tareas y perfiles. La interfaz los utiliza para identificar las filas.

Los importes por contribución, tarea, perfil y proyecto provienen del backend. El adaptador suma las horas para presentarlas y el gráfico calcula porcentajes de distribución. El CER consolidado se muestra cuando las contribuciones del perfil comparten una tarifa.

## Entregas Jira

| Tarea    | Implementación                                                                                                                              | Archivos principales                                                                                                                                           | Verificación                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| PMGT-143 | Consulta autenticada, cancelación, caché, reintentos acotados y estados de carga, error y ausencia de datos                                 | `services/costs-service.ts`, `hooks/project-cost-query-options.ts`, `adapters/adapt-project-cost-response.ts`, `ui/costs-view.tsx`, `ui/costs-error-state.tsx` | Pruebas aisladas de cliente HTTP, JWT, renovación, estados HTTP, consulta y renderizado               |
| PMGT-144 | Horas, CER y costo por contribución, total de cada tarea y moneda                                                                           | `types/task-cost.ts`, `ui/task-cost-rows.tsx`, `ui/task-costs-table.tsx`                                                                                       | Conservación de contribuciones, ceros, importes y renderizado de tabla                                |
| PMGT-145 | Total consolidado identificado como costo base y conservación de moneda nula                                                                | `types/project-cost-summary.ts`, `ui/project-cost-summary-card.tsx`, adaptador y vista                                                                         | Regresión de moneda y renderizado de monto cero sin símbolo monetario                                 |
| PMGT-146 | Tabla de horas, CER y subtotal por perfil, gráfico de barras responsive y estado vacío                                                      | `types/profile-cost-breakdown.ts`, `ui/profile-cost-breakdown-table.tsx`, `ui/profile-cost-distribution-chart.tsx`                                             | Subtotales, CER variable, porcentajes, total cero y encabezados accesibles                            |
| PMGT-147 | Invalidación reutilizable por proyecto o global, recarga al recuperar foco, escucha de almacenamiento entre pestañas y actualización manual | `hooks/query-keys.ts`, `hooks/use-cost-synchronization.ts`, opciones de consulta y vista                                                                       | Invalidación activa, aislamiento por proyecto, foco, eventos de almacenamiento y callbacks existentes |

Las rutas de archivos de la tabla son relativas a `src/features/costs/`.

## Sincronización

Las pantallas de horas y perfiles ya invalidan `project-costs` en sus callbacks de guardado. El backlog invalida la misma clave después de sus mutaciones. Se conservaron esas claves y se probaron los callbacks existentes.

Los futuros guardados de horas, CER y responsables pueden esperar `invalidateProjectCosts(queryClient, projectId)`. Para cambios de un perfil que afecten varios proyectos pueden esperar `invalidateProjectCosts(queryClient)`. Estas funciones están en `src/features/costs/hooks/query-keys.ts` y devuelven la promesa de invalidación.

La consulta comparte una clave por proyecto y conserva los datos frescos durante 30 segundos. Al recuperar el foco vuelve a consultar incluso durante ese intervalo. El botón de actualización queda deshabilitado durante una solicitud. Los eventos de almacenamiento de perfiles, horas del proyecto actual o limpieza del almacenamiento invalidan sus costos. Se retiran los listeners al desmontar el hook.

## Pruebas ejecutadas

Se utilizó Node.js 24.15.0 con las dependencias existentes. Los fixtures están en archivos de prueba. El cargador de pruebas transpila TypeScript con el compilador instalado y permite aislar servicios y hooks.

```bash
node --test tests/cost-task-breakdown.test.mjs tests/costs-integration.test.mjs
npx tsc --noEmit
npx eslint src/features/costs tests
npm run lint
npm run build
```

| Comprobación                     | Resultado                                                         |
| -------------------------------- | ----------------------------------------------------------------- |
| Pruebas automatizadas            | 24 aprobadas                                                      |
| TypeScript                       | Aprobado                                                          |
| Lint del proyecto                | Cero errores y siete advertencias de imports sin uso en Proyectos |
| Build de producción              | Aprobado, incluida la ruta dinámica de costos                     |
| Formato de archivos modificados  | Verificado con Prettier                                           |
| Consulta real a `localhost:8080` | Conexión rechazada, HTTP 000                                      |

El build requirió acceso a Google Fonts y mostró el aviso existente sobre un `package-lock.json` fuera del repositorio. Una comprobación amplia de Prettier también detectó diferencias previas en diez archivos de costos ajenos a esta modificación. La comprobación de formato de los archivos modificados se ejecuta por separado. Las pruebas de renderizado comprueban el HTML y las clases de desbordamiento horizontal. La revisión visual en un navegador con datos reales queda pendiente.

La suite verifica el envío de JWT, su renovación ante un 401, propagación de errores 400/401/403/404/409/500, respuesta 204, cancelación real del fetch de prueba, deduplicación, caché, invalidación por proyecto y cambios de foco. También verifica los cambios aislados de 9 h y CER 50 con costo 450, 10 h con costo 500 y CER 60 con costo 600. Los montos de esos casos se suministran como respuestas del backend de prueba.

## Limitaciones de integración

La API local está configurada en `http://localhost:8080` y no respondió durante la verificación. La autenticación y la consulta con una sesión real continúan pendientes.

`src/features/estimates/services/task-hours.service.ts` guarda ajustes de horas en almacenamiento local. `src/features/profiles/services/profiles-service.ts` también conserva CER y perfiles localmente. Invalidar la consulta vuelve a leer el backend, pero estos guardados locales todavía requieren su integración de persistencia para cambiar los costos reales.

PMGT-147 tiene verificados sus mecanismos de consulta e invalidación mediante pruebas aisladas. Su verificación de extremo a extremo queda pendiente de los guardados reales de horas y CER. La configuración de horas y perfiles y las escrituras del backend corresponden a sus módulos responsables.

## Registro de commits

La rama es `feature/frontend-costs-integration`. La referencia remota `develop` consultada fue `00f128f08ee8768b48dc1c99e173578ba51bea3b`, base de los commits de esta rama. El trabajo queda organizado en ocho commits, de acuerdo con el último encargo.

| Número | Jira                | Hash o estado | Mensaje                                                                       |
| ------ | ------------------- | ------------- | ----------------------------------------------------------------------------- |
| 1      | PMGT-143            | `754bce2`     | `feat(PMGT-143): add project cost API types and service`                      |
| 2      | PMGT-143            | `07e3058`     | `feat(PMGT-143): connect project cost queries to backend API`                 |
| 3      | PMGT-143            | `d5d44f6`     | `fix(PMGT-143): distinguish loading errors and empty cost responses`          |
| 4      | PMGT-144            | `7ecf84c`     | `feat(PMGT-144): display task cost contributions and hourly rates`            |
| 5      | PMGT-145            | `5607b7f`     | `fix(PMGT-145): preserve backend currencies and identify project base costs`  |
| 6      | PMGT-146            | `3cb1df3`     | `feat(PMGT-146): display profile cost table and distribution chart`           |
| 7      | PMGT-147            | `e779439`     | `feat(PMGT-147): synchronize project costs across views and window focus`     |
| 8      | PMGT-143 a PMGT-147 | `HEAD`        | `feat(PMGT-147): add cost integration verification and presentation evidence` |

El quinto commit incorpora tipos de resumen y perfil, adaptador, servicio compatible, tarjeta del total, tabla con moneda por perfil, regresiones del adaptador, cargador de pruebas y paso de moneda en la vista. El sexto incorpora el gráfico por perfil y su incorporación a la vista. El séptimo incorpora claves, opciones, hook de sincronización, hook de consulta y controles de actualización de la vista. El octavo incorpora la suite de integración y esta documentación con los issues publicados.

La vista principal tiene cambios de los commits 5, 6 y 7. Se prepararon por fragmentos para que cada commit incorporara su funcionalidad y se verificara antes de confirmarlo.

El octavo commit es la revisión que contiene esta documentación. Su hash se obtiene con `git log -1 --oneline` al finalizar la creación de los ocho commits.

## Issues publicados

Los issues [#45](https://github.com/edwinndev/software-estimation-client/issues/45), [#46](https://github.com/edwinndev/software-estimation-client/issues/46) y [#47](https://github.com/edwinndev/software-estimation-client/issues/47) están publicados con etiqueta `bug`. Sus causas, criterios, evidencias y commits de solución están registrados en [costs-issues.md](costs-issues.md). Permanecen abiertos para completar las verificaciones reales y la integración.

El issue #41 contiene una guía general del flujo del equipo y propone mensajes en español. Este trabajo conserva mensajes en inglés conforme a `AGENTS.md` del frontend y a la indicación explícita del usuario. [Guía del equipo](https://github.com/edwinndev/software-estimation-client/issues/41).

## Demostración al profesor

1. Mostrar el historial de la rama y relacionar los commits con las cinco tareas Jira.
2. Ejecutar las 24 pruebas y explicar que la respuesta HTTP de prueba controla los importes.
3. Mostrar en el adaptador que se copian los totales del backend y se conservan sus monedas y contribuciones.
4. Mostrar la tabla por tarea, la tarjeta de costo base y el gráfico por perfil cuando se disponga de una API autenticada con datos.
5. Explicar la invalidación de caché, la recarga al recuperar foco y la limitación actual de los guardados locales de horas y CER.
6. Mostrar los issues #45, #46 y #47 y sus criterios de aceptación. Vincularlos con el PR cuando se publique la rama.

## Descripción preparada para Pull Request

Título sugerido `Integrate backend project costs and synchronize cost breakdowns`.

Base `develop`. Rama de origen `feature/frontend-costs-integration`.

La vista de costos consulta el endpoint autenticado del proyecto y conserva los importes calculados por el backend. Presenta contribuciones por tarea, costo base consolidado, tabla y distribución por perfil, junto con estados de carga, errores y respuestas vacías. La consulta comparte caché por proyecto y se actualiza mediante invalidaciones, cambios de foco y actualización manual.

La validación incluye 24 pruebas aisladas, TypeScript, lint y build. La API local no respondió. La comprobación de extremo a extremo de cambios de horas y CER depende de su persistencia real en los módulos responsables.

Referencias preparadas para el PR `Refs #45, #46, #47`. Los commits de solución están creados localmente. La publicación de la rama y la apertura del PR requieren aprobación del usuario. El PR requiere revisión antes de integrarse a `develop`, según el flujo del equipo.

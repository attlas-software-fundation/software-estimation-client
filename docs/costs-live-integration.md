# Verificación real de costos — 15 de noviembre de 2026

La consulta y el recálculo se verificaron con HTTP real, JWT y PostgreSQL. No se sustituyeron las respuestas de la API. La evidencia reproducible está en [el reporte JSON](evidence/costs-live-api-20261115.json) y el ejecutor es `scripts/verify-costs-api.mjs`.

## Estado por tarea

| Tarea    | Resultado comprobado                                                           | Pendiente                                                 |
| -------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| PMGT-143 | Consulta autenticada, renovación de JWT, carga, error y respuesta vacía        | Revisión visual en navegador                              |
| PMGT-144 | Contribuciones, horas, tarifas y total por tarea provenientes de la API        | Revisión visual                                           |
| PMGT-145 | Total base real y moneda nula en proyecto vacío                                | Revisión visual                                           |
| PMGT-146 | Subtotales reales por perfil; tabla y distribución verificadas por renderizado | Revisión visual                                           |
| PMGT-147 | Recálculo real al cambiar horas, CER y responsables; invalidación y foco       | Flujo completo de guardado desde las pantallas de edición |

Estas son conclusiones técnicas, no cambios de estado realizados en Jira.

## Entorno y límites

Se utilizó el backend `86d61b505a0f4589ddb6556b14eb4c85bcda6c5f` en una copia temporal separada. Esa revisión no compilaba: varios imports apuntaban a paquetes inexistentes y una prueba entregaba una cadena donde correspondía un enum. Con autorización se corrigieron siete archivos exclusivamente en la copia temporal. [El parche](backend-costs-integration.patch) conserva esos cambios. Requiere `git apply --check --unidiff-zero` para comprobarlo contra esa revisión; no se aplicó a las copias originales.

La base existente impedía iniciar sesión por la ausencia de `in_scope.users.avatar_id`. Se conservó intacta. Con autorización se creó `inscope_costs_integration_20261115` y se inicializó con V1 y V2 del backend. La API temporal escucha en `127.0.0.1:8080`, con Flyway desactivado y `ddl-auto=none`. Por tanto, los resultados corresponden a este entorno de prueba corregido, no al backend original sin cambios.

El paquete de backlog `com.intecx.estimation` está fuera del escaneo de la aplicación principal y apunta a otro esquema. El frontend espera algunas rutas de tareas que la aplicación activa no expone. Además, los servicios de perfiles y ajustes de horas conservan persistencia local. No se modificaron esos contratos ni servicios de otros integrantes. Los tres hooks autorizados sí esperan la sincronización de costos al guardar. Esto corrige la carrera de caché, pero no convierte un guardado local en persistencia remota.

## Resultados

- 28 pruebas automatizadas del frontend aprobadas, incluidas validaciones y guardado durante la primera carga.
- 17 comprobaciones contra la API real aprobadas: contrato, CORS, login, refresh, carga, vacío, validaciones, horas, CER, foco, múltiples perfiles, responsables, 404, 401 y renderizado con datos reales.
- 14 pruebas del backend aprobadas en cinco clases de costos, sin iniciar migraciones.
- TypeScript, ESLint de archivos modificados y build de producción aprobados. El lint general conserva siete advertencias previas de imports sin uso en Proyectos.
- El arranque original de desarrollo fallaba porque Next propagaba `--env-file` a `NODE_OPTIONS`. Se reemplazó por un precargador que usa `process.loadEnvFile`, sin dependencias nuevas.
- No se completó revisión visual mediante navegador. El renderizado automatizado sí utilizó datos de la API real.

Las primeras ejecuciones detectaron fallos reales de compilación, esquema y arranque. Las correcciones de entorno descritas permitieron ejecutar las 17 comprobaciones; no se presentan esos fallos iniciales como pruebas aprobadas del entorno original.

## Demostración y reproducción

El proyecto de prueba conservado es `25b43db9-2ac8-42ff-901b-39da9a363d99`, identificado con `COSTS-1794730023054`. Los identificadores de historia, tarea y perfiles están en el reporte JSON. Solo se crearon y modificaron datos nuevos autorizados; no se eliminaron datos.

Se comprobaron estas transiciones: 9 h × 50 = 450; 10 h × 50 = 500; CER 60 = 600; CER 65 y recuperación de foco = 650. Con dos perfiles, el reparto devolvió 300 y 200, total 500. Al cambiar el responsable al perfil de tarifa 40, el total fue 400. El estado final conservado es 10 h, tarifa 60 y total 600 PEN.

Consulta sin crear nuevos datos, con la API temporal disponible:

```powershell
node --env-file=.env.dev scripts/verify-costs-api.mjs --seed-account --project 25b43db9-2ac8-42ff-901b-39da9a363d99
```

El modo `--seed-account` toma las credenciales de desarrollo ya documentadas en README; no imprime tokens ni claves. Para otro entorno se utilizan `COSTS_TEST_EMAIL` y `COSTS_TEST_PASSWORD`. El modo `--create-fixture` crea nuevos datos y solo debe ejecutarse con autorización para ese entorno.

Ruta de demostración: `http://localhost:3000/projects/25b43db9-2ac8-42ff-901b-39da9a363d99/costs`. Iniciar sesión primero. Las pruebas automatizadas se repiten con:

```powershell
node --test tests/cost-task-breakdown.test.mjs tests/costs-integration.test.mjs tests/costs-validation-errors.test.mjs tests/costs-invalidation-race.test.mjs
```

El servidor de desarrollo corregido alcanz? `Ready`, pero la compilaci?n de `/login` no termin? durante la comprobaci?n y se detuvo esa ejecuci?n. Con `npm run start`, `/login` y la ruta de costos respondieron HTTP 200. Esto comprueba la entrega de las p?ginas; autenticaci?n y datos se verificaron por separado en las 17 pruebas reales.

## Commits e Issues

Los ocho commits iniciales se conservaron. Las unidades adicionales incluyen:

| Commit    | Cambio                                                                |
| --------- | --------------------------------------------------------------------- |
| `c97ad36` | Mensajes reales de validación, PMGT-143, Issue #48                    |
| `f0a82d8` | Cancelar consultas anteriores antes de invalidar, PMGT-147, Issue #49 |
| `7f0cc16` | Ejecutor de verificación con API real                                 |

El ajuste de arranque est? en `be267ed`. Esta evidencia se registran en unidades adicionales. Los hashes finales se consultan con `git log --oneline origin/develop..HEAD`.

Issues nuevos: [#48](https://github.com/edwinndev/software-estimation-client/issues/48) y [#49](https://github.com/edwinndev/software-estimation-client/issues/49). Se revisaron Issues abiertos y cerrados antes de publicarlos. Las causas son independientes y sus regresiones fallaban antes de las correcciones.

Los Issues [#45](https://github.com/edwinndev/software-estimation-client/issues/45), [#46](https://github.com/edwinndev/software-estimation-client/issues/46), [#47](https://github.com/edwinndev/software-estimation-client/issues/47), #48 y #49 permanecen abiertos. Las soluciones están en commits locales; falta publicación, revisión e integración según el flujo del equipo. No se hizo push, merge ni se abrió un PR.

## Siguiente integración necesaria

El equipo debe resolver el arranque y esquema del backend en su flujo normal y acordar las rutas de backlog y la persistencia remota de horas y perfiles. Después corresponde verificar el guardado desde las pantallas completas y realizar la revisión visual. La rama contiene el módulo de costos y evidencia revisable, pero no se declara completado ese flujo de edición de extremo a extremo.

# Diseno de automatizacion tecnica - API Testing

## Alcance

Automatizar pruebas para el microservicio de asignacion de pedidos:

- Metodo: `POST`
- Endpoint: `/api/v1/orders/assign`
- Header requerido: `Authorization: Bearer <token>`
- Header requerido: `Content-Type: application/json`

## Herramienta y lenguaje

- Framework: Playwright Test
- Lenguaje: TypeScript
- Ejecucion: `npm run test:api`
- Reporte: HTML nativo de Playwright

Playwright es adecuado para este reto porque permite automatizar pruebas HTTP con `APIRequestContext`, manejar headers globales, parametrizar ambientes y generar reportes sin depender de un navegador.

## Patron y arquitectura

Se usa una variante del patron POM aplicada a API:

- `src/api/OrderAssignmentApi.ts`: objeto responsable de consumir el endpoint y centralizar validaciones comunes.
- `src/fixtures/orderAssignment.fixtures.ts`: datos reutilizables y builders de requests.
- `src/types/orderAssignment.types.ts`: contratos TypeScript para request, response y errores.
- `src/mocks/orderAssignmentMockServer.ts`: simulacion local del microservicio para ejecutar el reto sin ambiente externo.
- `tests/fixtures/apiTest.ts`: fixture de Playwright que levanta el mock server y entrega un `APIRequestContext`.
- `tests/api/orderAssignment.spec.ts`: escenarios de negocio expresados como pruebas.

Esta separacion evita duplicar llamadas HTTP, facilita mantener cambios del contrato y deja los tests enfocados en el comportamiento esperado.

## Simulacion del servicio

El proyecto incluye un servidor HTTP local en Node.js que simula el endpoint `POST /api/v1/orders/assign`.

Reglas simuladas:

- Token valido: `Bearer valid-token`.
- Prioridades permitidas: `NORMAL`, `URGENT`, `EXPRESS`.
- Formato de pedido: `ORD-2025-<6 digitos>`.
- Formato de operador: `OP-<3 digitos>`.
- Formato de almacen: `WH-<2 digitos>`.
- Pedido inexistente simulado: `ORD-2025-000404`.
- Operador inactivo simulado: `OP-000`.
- Almacen invalido simulado: `WH-99`.
- Pedido ya asignado: respuesta `409 Conflict`.

Esta simulacion permite demostrar el diseno completo del reto aunque no se tenga acceso al microservicio real.

## Contrato de entrada

```json
{
  "orderId": "ORD-2025-007841",
  "operatorId": "OP-312",
  "warehouseId": "WH-05",
  "priority": "NORMAL"
}
```

## Contrato de salida esperada

Codigo HTTP esperado para asignacion exitosa: `201 Created`.

```json
{
  "assignmentId": "ASG-44021",
  "orderId": "ORD-2025-007841",
  "operatorId": "OP-312",
  "status": "ASSIGNED",
  "timestamp": "2025-10-15T14:30:00Z"
}
```

## Casos a disenar

### Casos positivos

1. Asignacion exitosa con prioridad `NORMAL`.
2. Asignacion exitosa con prioridad `URGENT`.
3. Asignacion exitosa con prioridad `EXPRESS`.

Validaciones:

- Status HTTP `201`.
- `assignmentId` cumple formato esperado `ASG-<numeros>`.
- `orderId` en response coincide con el request.
- `operatorId` en response coincide con el request.
- `status` es `ASSIGNED`.
- `timestamp` tiene formato de fecha valido.

### Casos negativos

1. Token invalido.
2. Pedido inexistente.
3. Operador inactivo.
4. Almacen invalido.
5. Prioridad no permitida.
6. Body sin campos requeridos.

Validaciones:

- Token invalido: HTTP `401`.
- Pedido inexistente: HTTP `404`.
- Operador inactivo: HTTP `422`.
- Almacen invalido: HTTP `404`.
- Prioridad no permitida: HTTP `400`.
- Campos requeridos ausentes o vacios: HTTP `400`.
- Mensaje de error presente en `message` o `error`.

### Casos limite

1. Campos vacios.
2. `orderId`, `operatorId` o `warehouseId` con formato invalido.
3. Pedido ya asignado a otro operador.
4. Longitudes maximas permitidas.
5. Caracteres especiales en identificadores.

### Concurrencia

1. Dos supervisores asignan el mismo pedido al mismo tiempo.
2. Varias solicitudes intentan asignar distintos pedidos al mismo operador.
3. Reintento de asignacion despues de una respuesta conflictiva.

Validaciones sugeridas:

- Solo una solicitud debe confirmar la asignacion.
- Las solicitudes competidoras deben responder con conflicto controlado, por ejemplo `409 Conflict`.
- No debe generarse mas de un `assignmentId` activo para el mismo pedido.

## Ejemplos implementados

El archivo `tests/api/orderAssignment.spec.ts` incluye:

1. Caso positivo: asignacion exitosa para prioridades `NORMAL`, `URGENT` y `EXPRESS`.
2. Caso negativo: rechazo con token invalido.
3. Caso negativo: pedido inexistente.
4. Caso negativo: operador inactivo.
5. Caso negativo: almacen invalido.
6. Caso limite: campos vacios y formatos invalidos.
7. Caso limite: pedido ya asignado a otro operador.
8. Caso de concurrencia: dos solicitudes intentan asignar el mismo pedido simultaneamente.

## Matriz de cobertura

| Tipo de caso | Escenario | Resultado esperado |
| --- | --- | --- |
| Positivo | Prioridad `NORMAL` | `201 Created` y estado `ASSIGNED` |
| Positivo | Prioridad `URGENT` | `201 Created` y estado `ASSIGNED` |
| Positivo | Prioridad `EXPRESS` | `201 Created` y estado `ASSIGNED` |
| Negativo | Token invalido | `401 Unauthorized` |
| Negativo | Pedido inexistente | `404 Not Found` |
| Negativo | Operador inactivo | `422 Unprocessable Entity` |
| Negativo | Almacen invalido | `404 Not Found` |
| Limite | Campos vacios | `400 Bad Request` |
| Limite | IDs con formato invalido | `400 Bad Request` |
| Limite | Pedido asignado a otro operador | `409 Conflict` |
| Concurrencia | Dos asignaciones simultaneas del mismo pedido | Una respuesta `201` y una respuesta `409` |

## Ejemplo de codigo positivo

```ts
test('asigna una orden exitosamente para cada prioridad valida', async ({
  mockedRequest
}) => {
  const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);

  for (const [index, priority] of validPriorities.entries()) {
    const payload = buildAssignOrderRequest({
      orderId: `ORD-2025-10000${index}`,
      priority
    });

    const response = await orderAssignmentApi.assignOrder(payload);
    const body = await orderAssignmentApi.expectCreated(response);

    expect(body.orderId).toBe(payload.orderId);
    expect(body.operatorId).toBe(payload.operatorId);
  }
});
```

## Ejemplo de codigo negativo

```ts
test('rechaza la asignacion cuando el token es invalido', async ({
  mockedRequest
}) => {
  const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
  const payload = buildAssignOrderRequest();

  const response = await orderAssignmentApi.assignOrderWithToken(
    payload,
    invalidToken
  );

  await orderAssignmentApi.expectClientError(response, 401);
});
```

## Consideraciones de ambiente

Las variables se configuran por ambiente:

- `BASE_URL`: URL base del microservicio.
- `API_TOKEN`: token valido para autenticar las pruebas.

El archivo `.env.example` documenta los valores requeridos. En ejecuciones CI/CD se recomienda inyectarlos como secretos.

Para ejecutar la simulacion incluida no se requiere configurar `BASE_URL`, porque el fixture `tests/fixtures/apiTest.ts` crea un servidor local por prueba.

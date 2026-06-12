import { test, expect } from '../fixtures/apiTest';
import { OrderAssignmentApi } from '@api/OrderAssignmentApi';
import {
  buildAssignOrderRequest,
  existingOrderId,
  inactiveOperatorId,
  invalidWarehouseId,
  invalidToken,
  nonExistentOrderId,
  validPriorities
} from '@fixtures/orderAssignment.fixtures';

test.describe('POST /api/v1/orders/assign', () => {
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

  test('rechaza la asignacion cuando el pedido no existe', async ({
    mockedRequest
  }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
    const payload = buildAssignOrderRequest({ orderId: nonExistentOrderId });

    const response = await orderAssignmentApi.assignOrder(payload);

    await orderAssignmentApi.expectClientError(response, 404);
  });

  test('rechaza la asignacion cuando el operador esta inactivo', async ({
    mockedRequest
  }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
    const payload = buildAssignOrderRequest({ operatorId: inactiveOperatorId });

    const response = await orderAssignmentApi.assignOrder(payload);

    await orderAssignmentApi.expectClientError(response, 422);
  });

  test('rechaza la asignacion cuando el almacen es invalido', async ({
    mockedRequest
  }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
    const payload = buildAssignOrderRequest({ warehouseId: invalidWarehouseId });

    const response = await orderAssignmentApi.assignOrder(payload);

    await orderAssignmentApi.expectClientError(response, 404);
  });

  test('rechaza campos vacios y formatos invalidos', async ({ mockedRequest }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
    const emptyFieldResponse = await orderAssignmentApi.assignOrder(
      buildAssignOrderRequest({ orderId: '' })
    );
    const invalidFormatResponse = await orderAssignmentApi.assignOrder(
      buildAssignOrderRequest({ operatorId: 'OP-ABC' })
    );

    await orderAssignmentApi.expectClientError(emptyFieldResponse, 400);
    await orderAssignmentApi.expectClientError(invalidFormatResponse, 400);
  });

  test('rechaza pedido ya asignado a otro operador', async ({ mockedRequest }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);

    await orderAssignmentApi.expectCreated(
      await orderAssignmentApi.assignOrder(
        buildAssignOrderRequest({
          orderId: existingOrderId,
          operatorId: 'OP-312'
        })
      )
    );

    const response = await orderAssignmentApi.assignOrder(
      buildAssignOrderRequest({
        orderId: existingOrderId,
        operatorId: 'OP-777'
      })
    );

    await orderAssignmentApi.expectClientError(response, 409);
  });

  test('controla concurrencia al asignar el mismo pedido simultaneamente', async ({
    mockedRequest
  }) => {
    const orderAssignmentApi = new OrderAssignmentApi(mockedRequest);
    const orderId = 'ORD-2025-777001';

    const responses = await Promise.all([
      orderAssignmentApi.assignOrder(
        buildAssignOrderRequest({ orderId, operatorId: 'OP-312' })
      ),
      orderAssignmentApi.assignOrder(
        buildAssignOrderRequest({ orderId, operatorId: 'OP-777' })
      )
    ]);

    const statuses = responses.map((response) => response.status()).sort();

    expect(statuses).toEqual([201, 409]);
  });
});

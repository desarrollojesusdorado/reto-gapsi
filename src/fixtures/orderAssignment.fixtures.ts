import { AssignOrderRequest, OrderPriority } from '@contracts/orderAssignment.types';

export const validPriorities: OrderPriority[] = ['NORMAL', 'URGENT', 'EXPRESS'];

export const buildAssignOrderRequest = (
  overrides: Partial<AssignOrderRequest> = {}
): AssignOrderRequest => ({
  orderId: 'ORD-2025-123456',
  operatorId: 'OP-312',
  warehouseId: 'WH-05',
  priority: 'NORMAL',
  ...overrides
});

export const invalidToken = 'invalid-token';

export const existingOrderId = 'ORD-2025-007841';

export const nonExistentOrderId = 'ORD-2025-000404';

export const inactiveOperatorId = 'OP-000';

export const invalidWarehouseId = 'WH-99';

export type OrderPriority = 'NORMAL' | 'URGENT' | 'EXPRESS';

export interface AssignOrderRequest {
  orderId: string;
  operatorId: string;
  warehouseId: string;
  priority: OrderPriority;
}

export interface AssignOrderResponse {
  assignmentId: string;
  orderId: string;
  operatorId: string;
  status: 'ASSIGNED';
  timestamp: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}

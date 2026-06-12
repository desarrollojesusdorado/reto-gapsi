import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import {
  ApiErrorResponse,
  AssignOrderRequest,
  AssignOrderResponse
} from '@contracts/orderAssignment.types';

export class OrderAssignmentApi {
  private readonly endpoint = '/api/v1/orders/assign';

  constructor(private readonly request: APIRequestContext) {}

  async assignOrder(payload: AssignOrderRequest): Promise<APIResponse> {
    return this.request.post(this.endpoint, {
      data: payload
    });
  }

  async assignOrderWithToken(
    payload: AssignOrderRequest,
    token: string
  ): Promise<APIResponse> {
    return this.request.post(this.endpoint, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async expectCreated(response: APIResponse): Promise<AssignOrderResponse> {
    expect(response.status()).toBe(201);

    const body = (await response.json()) as AssignOrderResponse;
    expect(body.assignmentId).toMatch(/^ASG-\d+$/);
    expect(body.orderId).toBeTruthy();
    expect(body.operatorId).toBeTruthy();
    expect(body.status).toBe('ASSIGNED');
    expect(Date.parse(body.timestamp)).not.toBeNaN();

    return body;
  }

  async expectClientError(
    response: APIResponse,
    expectedStatus: number
  ): Promise<ApiErrorResponse> {
    expect(response.status()).toBe(expectedStatus);

    const body = (await response.json()) as ApiErrorResponse;
    expect(body.message ?? body.error).toBeTruthy();

    return body;
  }
}

import { createServer, IncomingMessage, Server, ServerResponse } from 'node:http';
import { AddressInfo } from 'node:net';
import { AssignOrderRequest, OrderPriority } from '@contracts/orderAssignment.types';

const validToken = 'valid-token';
const validPriorities: OrderPriority[] = ['NORMAL', 'URGENT', 'EXPRESS'];

interface AssignmentRecord {
  assignmentId: string;
  orderId: string;
  operatorId: string;
}

export interface MockServerHandle {
  baseURL: string;
  close: () => Promise<void>;
}

export async function startOrderAssignmentMockServer(): Promise<MockServerHandle> {
  const assignments = new Map<string, AssignmentRecord>();

  const server = createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/api/v1/orders/assign') {
      sendJson(res, 404, { message: 'Endpoint not found' });
      return;
    }

    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${validToken}`) {
      sendJson(res, 401, { message: 'Invalid or missing token' });
      return;
    }

    const payload = await readJsonBody(req);
    const validationError = validatePayload(payload);
    if (validationError) {
      sendJson(res, validationError.status, { message: validationError.message });
      return;
    }

    const requestBody = payload as AssignOrderRequest;

    if (requestBody.orderId === 'ORD-2025-000404') {
      sendJson(res, 404, { message: 'Order does not exist' });
      return;
    }

    if (requestBody.operatorId === 'OP-000') {
      sendJson(res, 422, { message: 'Operator is inactive' });
      return;
    }

    if (requestBody.warehouseId === 'WH-99') {
      sendJson(res, 404, { message: 'Warehouse does not exist' });
      return;
    }

    const currentAssignment = assignments.get(requestBody.orderId);
    if (currentAssignment && currentAssignment.operatorId !== requestBody.operatorId) {
      sendJson(res, 409, { message: 'Order is already assigned to another operator' });
      return;
    }

    if (currentAssignment) {
      sendJson(res, 409, { message: 'Order is already assigned' });
      return;
    }

    const assignment: AssignmentRecord = {
      assignmentId: `ASG-${44000 + assignments.size + 1}`,
      orderId: requestBody.orderId,
      operatorId: requestBody.operatorId
    };
    assignments.set(requestBody.orderId, assignment);

    sendJson(res, 201, {
      ...assignment,
      status: 'ASSIGNED',
      timestamp: '2025-10-15T14:30:00Z'
    });
  });

  await listen(server);

  const address = server.address() as AddressInfo;
  return {
    baseURL: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      })
  };
}

function listen(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8');
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
  });
}

function validatePayload(payload: unknown): { status: number; message: string } | null {
  if (!payload || typeof payload !== 'object') {
    return { status: 400, message: 'Request body must be a JSON object' };
  }

  const body = payload as Partial<AssignOrderRequest>;
  const requiredFields: Array<keyof AssignOrderRequest> = [
    'orderId',
    'operatorId',
    'warehouseId',
    'priority'
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      return { status: 400, message: `${field} is required` };
    }
  }

  if (!/^ORD-2025-\d{6}$/.test(body.orderId ?? '')) {
    return { status: 400, message: 'orderId has invalid format' };
  }

  if (!/^OP-\d{3}$/.test(body.operatorId ?? '')) {
    return { status: 400, message: 'operatorId has invalid format' };
  }

  if (!/^WH-\d{2}$/.test(body.warehouseId ?? '')) {
    return { status: 400, message: 'warehouseId has invalid format' };
  }

  if (!validPriorities.includes(body.priority as OrderPriority)) {
    return { status: 400, message: 'priority is not allowed' };
  }

  return null;
}

function sendJson(res: ServerResponse, status: number, body: object): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

import { request as playwrightRequest, test as base } from '@playwright/test';
import { startOrderAssignmentMockServer } from '../../src/mocks/orderAssignmentMockServer';

interface ApiFixtures {
  mockedRequest: Awaited<ReturnType<typeof playwrightRequest.newContext>>;
}

export const test = base.extend<ApiFixtures>({
  mockedRequest: async ({}, use) => {
    const mockServer = await startOrderAssignmentMockServer();
    const requestContext = await playwrightRequest.newContext({
      baseURL: mockServer.baseURL,
      extraHTTPHeaders: {
        Authorization: 'Bearer valid-token',
        'Content-Type': 'application/json'
      }
    });

    await use(requestContext);

    await requestContext.dispose();
    await mockServer.close();
  }
});

export { expect } from '@playwright/test';

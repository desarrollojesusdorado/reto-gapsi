import { test as base } from '@playwright/test';
import { startControlCenterServer } from '../../src/server/controlCenterServer';

interface WebFixtures {
  controlCenterBaseUrl: string;
}

export const test = base.extend<WebFixtures>({
  controlCenterBaseUrl: async ({}, use) => {
    const server = await startControlCenterServer();

    await use(server.baseURL);

    await server.close();
  }
});

export { expect } from '@playwright/test';

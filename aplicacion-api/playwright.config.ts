import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://api.example.com',
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN ?? 'replace-with-token'}`,
      'Content-Type': 'application/json'
    },
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/
    }
  ]
});

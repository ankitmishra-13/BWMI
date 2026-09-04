import { defineConfig, devices } from '@playwright/test';

const remoteBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  // The desktop and mobile projects share one local D1 database. Serialising
  // them avoids lock contention and dev-server module reload races.
  workers: 1,
  timeout: 60_000,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: remoteBaseUrl ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  webServer: remoteBaseUrl
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000/en',
        reuseExistingServer: true,
        timeout: 180_000,
      },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 5'] } },
  ],
});

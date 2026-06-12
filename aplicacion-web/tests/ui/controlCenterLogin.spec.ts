import { test } from '../fixtures/webTest';
import { ControlCenterLoginPage } from '@pages/ControlCenterLoginPage';
import {
  invalidCredentialCases,
  validCredentials,
  validationCases
} from '@fixtures/login.fixtures';

test.describe('Centro de Control - Login', () => {
  test('happy path: login exitoso y verificacion de landing page', async ({
    page,
    controlCenterBaseUrl
  }) => {
    const loginPage = new ControlCenterLoginPage(page, controlCenterBaseUrl);

    await loginPage.goto();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(validCredentials.username, validCredentials.password);

    await loginPage.expectLandingPageVisible();
  });

  for (const credentialCase of invalidCredentialCases) {
    test(`rechaza credenciales invalidas: ${credentialCase.name}`, async ({
      page,
      controlCenterBaseUrl
    }) => {
      const loginPage = new ControlCenterLoginPage(page, controlCenterBaseUrl);

      await loginPage.goto();
      await loginPage.login(credentialCase.username, credentialCase.password);

      await loginPage.expectLoginError('Usuario o contrasena incorrectos.');
    });
  }

  for (const validationCase of validationCases) {
    test(`valida campos: ${validationCase.name}`, async ({
      page,
      controlCenterBaseUrl
    }) => {
      const loginPage = new ControlCenterLoginPage(page, controlCenterBaseUrl);

      await loginPage.goto();
      await loginPage.login(validationCase.username, validationCase.password);

      await loginPage.expectLoginError(validationCase.expectedMessage);
    });
  }
});

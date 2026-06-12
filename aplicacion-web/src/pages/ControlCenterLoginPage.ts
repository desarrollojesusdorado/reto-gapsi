import { expect, Locator, Page } from '@playwright/test';

export class ControlCenterLoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly feedbackMessage: Locator;
  readonly loginPanel: Locator;
  readonly landingPage: Locator;
  readonly welcomeMessage: Locator;
  readonly pendingOrders: Locator;
  readonly activeOperators: Locator;

  constructor(
    private readonly page: Page,
    private readonly baseURL: string
  ) {
    this.usernameInput = page.getByTestId('username-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByRole('button', { name: 'Entrar' });
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
    this.feedbackMessage = page.getByTestId('login-feedback');
    this.loginPanel = page.getByTestId('login-panel');
    this.landingPage = page.getByTestId('landing-page');
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.pendingOrders = page.getByTestId('pending-orders');
    this.activeOperators = page.getByTestId('active-operators');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.baseURL);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.loginPanel).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Centro de Control - Login' })).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async expectLandingPageVisible(): Promise<void> {
    await expect(this.landingPage).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Panel de Control' })).toBeVisible();
    await expect(this.welcomeMessage).toHaveText('Bienvenido, supervisor de operaciones.');
    await expect(this.pendingOrders).toHaveText('12');
    await expect(this.activeOperators).toHaveText('8');
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginPanel).toBeVisible();
    await expect(this.landingPage).toBeHidden();
    await expect(this.feedbackMessage).toHaveText(message);
  }
}

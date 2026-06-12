const validUser = 'admin';
const validPassword = 'Admin123!';
const maxLength = 20;
const safeTextPattern = /^[a-zA-Z0-9@._!-]+$/;

const loginPanel = document.querySelector('[data-testid="login-panel"]');
const landingPage = document.querySelector('[data-testid="landing-page"]');
const form = document.querySelector('#login-form');
const usernameInput = document.querySelector('[data-testid="username-input"]');
const passwordInput = document.querySelector('[data-testid="password-input"]');
const feedback = document.querySelector('[data-testid="login-feedback"]');
const logoutButton = document.querySelector('[data-testid="logout-button"]');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const validationMessage = validateCredentials(username, password);

  if (validationMessage) {
    feedback.textContent = validationMessage;
    return;
  }

  if (username !== validUser || password !== validPassword) {
    feedback.textContent = 'Usuario o contrasena incorrectos.';
    return;
  }

  feedback.textContent = '';
  loginPanel.classList.add('hidden');
  landingPage.classList.remove('hidden');
});

logoutButton.addEventListener('click', () => {
  usernameInput.value = '';
  passwordInput.value = '';
  landingPage.classList.add('hidden');
  loginPanel.classList.remove('hidden');
  usernameInput.focus();
});

function validateCredentials(username, password) {
  if (!username || !password) {
    return 'Usuario y contrasena son obligatorios.';
  }

  if (username.length > maxLength || password.length > maxLength) {
    return 'Usuario y contrasena no deben superar 20 caracteres.';
  }

  if (!safeTextPattern.test(username) || !safeTextPattern.test(password)) {
    return 'Usuario y contrasena contienen caracteres no permitidos.';
  }

  return '';
}

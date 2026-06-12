export const validCredentials = {
  username: 'admin',
  password: 'Admin123!'
};

export const invalidCredentialCases = [
  {
    name: 'usuario incorrecto',
    username: 'operador',
    password: validCredentials.password
  },
  {
    name: 'contrasena incorrecta',
    username: validCredentials.username,
    password: 'Wrong123!'
  },
  {
    name: 'usuario y contrasena incorrectos',
    username: 'operador',
    password: 'Wrong123!'
  }
];

export const validationCases = [
  {
    name: 'campos vacios',
    username: '',
    password: '',
    expectedMessage: 'Usuario y contrasena son obligatorios.'
  },
  {
    name: 'caracteres especiales no permitidos',
    username: '<script>',
    password: 'Admin123!',
    expectedMessage: 'Usuario y contrasena contienen caracteres no permitidos.'
  },
  {
    name: 'longitud maxima excedida',
    username: 'adminadminadminadmin1',
    password: 'Admin123!',
    expectedMessage: 'Usuario y contrasena no deben superar 20 caracteres.'
  }
];

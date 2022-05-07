/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import { Register } from '../../src/components/Register.js';
import { VerifyEmail } from '../../src/components/VerifyEmail.js';
import { onNavigate, checkEmail, checkPassword } from '../../src/main.js';
import { signUpEmail } from '../../src/lib/firebaseAuth.js';
import { createUserWithEmailAndPassword } from '../../src/lib/firebaseUtils.js';

jest.mock('../../src/lib/firebaseUtils.js');
jest.mock('../../src/components/Feed.js');

beforeEach(() => {
  document.body.innerHTML = "<div id='root'></div>";
  Register();
});

describe('Ingreso con cuentas externas a la App', () => {
  it('Registra usuario de Google, ingresa, y lo lleva al Feed', (done) => {
    const registerDiv = Register();
    const buttonLoginGoogle = registerDiv.querySelector('#googleRegBtn');
    buttonLoginGoogle.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  it('Registra usuario de Facebook, ingresa, y lo lleva al Feed', (done) => {
    const registerDiv = Register();
    const buttonLoginFacebook = registerDiv.querySelector('#fbRegBtn');
    buttonLoginFacebook.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });
});

describe('Navegación entre páginas', () => {
  it('Devuelve a la página anterior', () => {
    const registerDiv = Register();
    const buttonLogin = registerDiv.querySelector('#createAccBtn');
    buttonLogin.dispatchEvent(new Event('click'));
    const VerifyComponent = VerifyEmail();
    expect(onNavigate('/verifyEmail')).toEqual(VerifyComponent);
  });

  it('Lleva a VerifyEmail', () => {
    const registerDiv = Register();
    const buttonLogin = registerDiv.querySelector('.icon-arrow-left2');
    buttonLogin.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toEqual('/');
  });
});

describe('Validación de email mientras el usuario ingresa el texto', () => {
  it('El correo está bien escrito, el input es verde, ósea válido', () => {
    const registerDiv = Register();
    const email = registerDiv.querySelector('#userEmail');
    email.value = 'front@end.la';
    const result = checkEmail(email.value);
    email.dispatchEvent(new Event('keyup'));
    expect(result).toBe(true);
  });

  it('El correo está mal escrito, el input es rojo ósea, inválido', () => {
    const registerDiv = Register();
    const email = registerDiv.querySelector('#userEmail');
    email.value = 'frontend.la';
    const result = checkEmail(email.value);
    email.dispatchEvent(new Event('keyup'));
    expect(result).toBe(false);
  });

  describe('Validación de contraseña mientras el usuario ingresa el texto', () => {
    it('La contraseña está bien escrita, el input es verde ósea válido', () => {
      const registerDiv = Register();
      const password = registerDiv.querySelector('#password');
      password.value = '12345678';
      const result = checkPassword(password.value);
      password.dispatchEvent(new Event('keyup'));
      expect(result).toBe(true);
    });
  });

  it('La contraseña está mal escrita, el input es rojo ósea inválido', () => {
    const registerDiv = Register();
    const password = registerDiv.querySelector('#password');
    password.value = '12345';
    const result = checkPassword(password.value);
    password.dispatchEvent(new Event('keyup'));
    expect(result).toBe(false);
  });

  describe('Mostar y ocultar contraseña', () => {
    it('Icono de ojo que muestra y oculta la contraseña', () => {
      const registerDiv = Register();
      const eyeSlash = registerDiv.querySelector('#eyeSlashLogo1');
      const password = registerDiv.querySelector('#password');
      password.type = 'password';
      eyeSlash.style.display = '';
      eyeSlash.dispatchEvent(new Event('click'));
      expect(password.type).toBe('text');
      expect(eyeSlash.style.display).toBe('none');
      if (eyeSlash.style.display === 'none') {
        const eye = registerDiv.querySelector('#eyeLogo1');
        eye.dispatchEvent(new Event('click'));
        expect(password.type).toBe('password');
        expect(eyeSlash.style.display).toBe('');
      }
    });
  });

  describe('Verifica creación de cuenta y si hay errores los muestra en pantalla', () => {
    beforeEach(() => createUserWithEmailAndPassword.mockClear());

    it('Crea la cuenta y muestra en pantalla, antes de derivar a VerifyEmail el mensaje: Your account is being created, please wait', (done) => {
      const registerDiv = Register();
      const buttonRegister = registerDiv.querySelector('#createAccBtn');
      const email = registerDiv.querySelector('#userEmail');
      email.value = 'front@end.la';
      const password = registerDiv.querySelector('#password');
      password.value = '12345678';
      buttonRegister.dispatchEvent(new Event('click'));
      signUpEmail(email.value, password.value);
      const result = registerDiv.querySelector('#progressMsg');
      result.innerText = 'Your account is being created, please wait';
      expect(result.innerText).toEqual('Your account is being created, please wait');
      done();
    });
  });

  it('Muestra mensajes si hay errores al crear la cuenta', (done) => {
    const registerDiv = Register();
    const buttonRegister = registerDiv.querySelector('#createAccBtn');
    const email = registerDiv.querySelector('#userEmail');
    email.value = 'frontend.la';
    const password = registerDiv.querySelector('#password');
    password.value = '12378';
    buttonRegister.dispatchEvent(new Event('click'));
    signUpEmail(email.value, password.value);
    const result = registerDiv.querySelector('#progressMsg');
    expect(result.innerText).toEqual('Wrong. Please, try again.');
    done();
  });
});

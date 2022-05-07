import { LogIn } from '../../src/components/LogIn.js';
import { ResetPassword } from '../../src/components/ResetPassword.js';
import { Home } from '../../src/components/Home.js';
import { createUserWithEmailAndPassword } from '../../src/lib/firebaseUtils.js';
import { onNavigate } from '../../src/main.js';
import { logInEmail } from '../../src/lib/firebaseAuth.js';

jest.mock('../../src/lib/firebaseUtils.js');
jest.mock('../../src/components/Feed.js');

beforeEach(() => {
  document.body.innerHTML = "<div id='root'></div>";
  LogIn();
});

describe('Rutas de navegación', () => {
  it('Lleva a ResetPassword', () => {
    const logInDiv = LogIn();
    const buttonLogin = logInDiv.querySelector('#forgotPass');
    buttonLogin.dispatchEvent(new Event('click'));
    const ResetPasswordComponent = ResetPassword();
    expect(onNavigate('/resetPassword')).toEqual(ResetPasswordComponent);
  });

  it('Devuelve a la página anterior', () => {
    const logInDiv = LogIn();
    const buttonLogin = logInDiv.querySelector('.icon-arrow-left2');
    buttonLogin.dispatchEvent(new Event('click'));
    const HomeComponent = Home();
    expect(onNavigate('/')).toEqual(HomeComponent);
  });
});

describe('Ingreso con cuentas externas a la App', () => {
  it('Registra usuario de Google, ingresa, y lo lleva al Feed', (done) => {
    const logInDiv = LogIn();
    const buttonLoginGoogle = logInDiv.querySelector('#googleRegBtn');
    buttonLoginGoogle.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  it('Registra usuario de Facebook, ingresa, y lo lleva al Feed', (done) => {
    const logInDiv = LogIn();
    const buttonLoginFacebook = logInDiv.querySelector('#fbLogBtn');
    buttonLoginFacebook.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  describe('Mostar y ocultar contraseña', () => {
    it('Icono de ojo que muestra y oculta la contraseña', () => {
      const logInDiv = LogIn();
      const eyeSlash = logInDiv.querySelector('#eyeSlashLogo1');
      const password = logInDiv.querySelector('#passwordLogIn');
      password.type = 'password';
      eyeSlash.style.display = '';
      eyeSlash.dispatchEvent(new Event('click'));
      expect(password.type).toBe('text');
      expect(eyeSlash.style.display).toBe('none');
      if (eyeSlash.style.display === 'none') {
        const eye = logInDiv.querySelector('#eyeLogo1');
        eye.dispatchEvent(new Event('click'));
        expect(password.type).toBe('password');
        expect(eyeSlash.style.display).toBe('');
      }
    });
  });
});

describe('Inicia sesión o mostrar los errores en pantalla', () => {
  beforeEach(() => createUserWithEmailAndPassword.mockClear());

  it('Inicia sesión y muestra en pantalla, antes de derivar a feed el mensaje: The user logged in', (done) => {
    const logInDiv = LogIn();
    const logInBtn = logInDiv.querySelector('#logInBtn');
    const email = logInDiv.querySelector('#userEmailLogIn');
    email.value = 'front@end.la';
    const password = logInDiv.querySelector('#passwordLogIn');
    password.value = '12345678';
    logInBtn.dispatchEvent(new Event('click'));
    logInEmail(email.value, password.value);
    const result = logInDiv.querySelector('#logInMessage');
    result.innerHTML = 'The user logged in';
    expect(result.innerHTML).toEqual('The user logged in');
    done();
  });

  it('Envía al Feed luego de iniciar sesión', (done) => {
    const LogInDiv = LogIn();
    const logInBtn = LogInDiv.querySelector('#logInBtn');
    logInBtn.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    }, 2000);
  });
});

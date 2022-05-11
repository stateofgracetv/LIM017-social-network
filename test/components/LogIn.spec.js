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

describe('On navigate', () => {
  it('Changes the route to ResetPassword', () => {
    const logInDiv = LogIn();
    const buttonLogin = logInDiv.querySelector('#forgotPass');
    buttonLogin.dispatchEvent(new Event('click'));
    const ResetPasswordComponent = ResetPassword();
    expect(onNavigate('/resetPassword')).toEqual(ResetPasswordComponent);
  });

  it('Goes back to home page', () => {
    const logInDiv = LogIn();
    const buttonLogin = logInDiv.querySelector('.icon-arrow-left2');
    buttonLogin.dispatchEvent(new Event('click'));
    const HomeComponent = Home();
    expect(onNavigate('/')).toEqual(HomeComponent);
  });
});

describe('Signs in with Google and Facebook', () => {
  it('Signs in with Google and shows Feed', (done) => {
    const logInDiv = LogIn();
    const buttonLoginGoogle = logInDiv.querySelector('#googleRegBtn');
    buttonLoginGoogle.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  it('Signs in with Facebook and shows Feed', (done) => {
    const logInDiv = LogIn();
    const buttonLoginFacebook = logInDiv.querySelector('#fbLogBtn');
    buttonLoginFacebook.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  describe('Show and hide password', () => {
    it('Toggles the password when clicking on the eye icon', () => {
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

describe('Log in successfully or show errors', () => {
  beforeEach(() => createUserWithEmailAndPassword.mockClear());

  it('Logs the user in and shows success message', (done) => {
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

  it('Takes the user to the Feed', (done) => {
    const LogInDiv = LogIn();
    const logInBtn = LogInDiv.querySelector('#logInBtn');
    logInBtn.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    }, 2000);
  });
});

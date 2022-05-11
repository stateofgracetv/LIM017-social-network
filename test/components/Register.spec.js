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

describe('Signs up with Google and Facebook', () => {
  it('Signs up with Google and shows Feed', (done) => {
    const registerDiv = Register();
    const buttonLoginGoogle = registerDiv.querySelector('#googleRegBtn');
    buttonLoginGoogle.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });

  it('Signs up with Facebook and shows Feed', (done) => {
    const registerDiv = Register();
    const buttonLoginFacebook = registerDiv.querySelector('#fbRegBtn');
    buttonLoginFacebook.dispatchEvent(new Event('click'));
    setTimeout(() => {
      expect(window.location.pathname).toBe('/feed');
      done();
    });
  });
});

describe('On navigate', () => {
  it('Takes the user to the Verify Email page on account creation', () => {
    const registerDiv = Register();
    const buttonLogin = registerDiv.querySelector('#createAccBtn');
    buttonLogin.dispatchEvent(new Event('click'));
    const VerifyComponent = VerifyEmail();
    expect(onNavigate('/verifyEmail')).toEqual(VerifyComponent);
  });

  it('Goes back to the Home page', () => {
    const registerDiv = Register();
    const buttonLogin = registerDiv.querySelector('.icon-arrow-left2');
    buttonLogin.dispatchEvent(new Event('click'));
    expect(window.location.pathname).toEqual('/');
  });
});

describe('On key up email validation', () => {
  it('Input turns green when valid', () => {
    const registerDiv = Register();
    const email = registerDiv.querySelector('#userEmail');
    email.value = 'front@end.la';
    const result = checkEmail(email.value);
    email.dispatchEvent(new Event('keyup'));
    expect(result).toBe(true);
  });

  it('Input turns red when invalid', () => {
    const registerDiv = Register();
    const email = registerDiv.querySelector('#userEmail');
    email.value = 'frontend.la';
    const result = checkEmail(email.value);
    email.dispatchEvent(new Event('keyup'));
    expect(result).toBe(false);
  });
});

describe('On key up password validation', () => {
  it('Input turns green when valid', () => {
    const registerDiv = Register();
    const password = registerDiv.querySelector('#password');
    password.value = '12345678';
    const result = checkPassword(password.value);
    password.dispatchEvent(new Event('keyup'));
    expect(result).toBe(true);
  });

  it('Input turns red when invalid', () => {
    const registerDiv = Register();
    const password = registerDiv.querySelector('#password');
    password.value = '12345';
    const result = checkPassword(password.value);
    password.dispatchEvent(new Event('keyup'));
    expect(result).toBe(false);
  });
});

describe('Show and hide password', () => {
  it('Toggles the password when clicking on the eye icon', () => {
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

describe('Verifies status of account creation and shows message accordingly', () => {
  beforeEach(() => createUserWithEmailAndPassword.mockClear());

  it('If account creation is successful, shows "Your account is being created, please wait"', (done) => {
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

  it('Shows errors if there are any', (done) => {
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

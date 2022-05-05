import { ResetPassword } from '../../src/components/ResetPassword.js';
import { onNavigate } from '../../src/main.js';
import { LogIn } from '../../src/components/LogIn.js';
import { Home } from '../../src/components/Home.js';

jest.mock('../../src/lib/firebaseUtils.js');
jest.mock('../../src/components/Feed.js');

beforeEach(() => {
  document.body.innerHTML = "<div id='root'></div>";
  ResetPassword();
});

describe('Rutas de navegación', () => {
  it('Redirige a LogIn', () => {
    const resetPassDiv = ResetPassword();
    const buttonresetPass = resetPassDiv.querySelector('#backLogIn');
    buttonresetPass.dispatchEvent(new Event('click'));
    const logInComponent = LogIn();
    expect(onNavigate('/logIn')).toEqual(logInComponent);
  });

  it('Redirige a Home', () => {
    const resetPassDiv = ResetPassword();
    const buttonresetPass = resetPassDiv.querySelector('#goToRegisterBtn');
    buttonresetPass.dispatchEvent(new Event('click'));
    const homeComponent = Home();
    expect(onNavigate('/')).toEqual(homeComponent);
  });
});

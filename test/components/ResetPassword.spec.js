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

describe('On navigate', () => {
  it('Takes user to Reser Password page', () => {
    const resetPassDiv = ResetPassword();
    const buttonresetPass = resetPassDiv.querySelector('#backLogIn');
    buttonresetPass.dispatchEvent(new Event('click'));
    const logInComponent = LogIn();
    expect(onNavigate('/logIn')).toEqual(logInComponent);
  });

  it('Takes user back to home page', () => {
    const resetPassDiv = ResetPassword();
    const buttonresetPass = resetPassDiv.querySelector('#goToRegisterBtn');
    buttonresetPass.dispatchEvent(new Event('click'));
    const homeComponent = Home();
    expect(onNavigate('/')).toEqual(homeComponent);
  });
});

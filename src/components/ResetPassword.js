/* eslint-disable import/no-cycle */
import { recoverPasswordWithEmail } from '../lib/firebaseAuth.js';
import { onNavigate } from '../main.js';

export const ResetPassword = () => {
  const resetPassDiv = document.createElement('div');
  const containerPassDiv = `
  <header class="headerReset">
    <img src="images/logotype/Full-logo.png" alt="Binge Worthy logo" class="fullLogo left">
  </header>
  <div class="containerFirstPart">
    <figure>
      <img src="images/desktop/padlock.png" alt="Binge Worthy padlock" class="padlock">
    </figure>
    <div>
      <h2 class="purple w6 headerMsg2" >Do you have trouble logging in?</h2>
      <p class="purple headerFontMedium" >Enter your email and will <br>
      send you a link to log back <br>
      into your account</p>
    </div>
    <form action="" method="POST" class="form">
      <div class="formGroup">
        <input type="email" name="email" id="userEmailPassReset" placeholder="email" class="formItem">
        <label class="formLabel" for="email" id="labelResetPass">Email</label>
      </div>
      <div class="flex">
        <input type="button" id="sendResetEmail" value="Send access link" class="button space">
        <input type="button" id="backLogIn" value="Back to log in" class="button space">
      </div>
      <div>
        <p id="sendEmailMsg"></p>
        <a id="goToRegisterBtn" class="purple w5 link send">Create new account</a>
      </div>
    </form>
  </div>
  `;
  resetPassDiv.innerHTML = containerPassDiv;
  const email = resetPassDiv.querySelector('#userEmailPassReset');
  const sendResetEmail = resetPassDiv.querySelector('#sendResetEmail');
  const sendEmailMsg = resetPassDiv.querySelector('#sendEmailMsg');
  const backLogIn = resetPassDiv.querySelector('#backLogIn');
  const goToRegisterBtn = resetPassDiv.querySelector('#goToRegisterBtn');
  sendResetEmail.addEventListener('click', () => {
    recoverPasswordWithEmail(email.value)
      .then(() => {
        sendEmailMsg.innerHTML = 'Password reset email sent,<br>please check you email';
        email.classList.add('valid');
      })
      .catch((error) => {
        if (error.code === 'auth/missing-email') {
          sendEmailMsg.innerHTML = 'Enter your email';
          email.classList.add('invalid');
        } else if (error.code === 'auth/invalid-email') {
          sendEmailMsg.innerHTML = 'Invalid email';
          email.classList.add('invalid');
        } else if (error.code === 'auth/user-not-found') {
          sendEmailMsg.innerHTML = 'User not found';
          email.classList.add('invalid');
        }
      });
  });
  backLogIn.addEventListener('click', () => {
    onNavigate('/logIn');
  });
  goToRegisterBtn.addEventListener('click', () => {
    onNavigate('/register');
  });
  return resetPassDiv;
};

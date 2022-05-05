/* eslint-disable import/no-cycle */
import { onNavigate } from '../main.js';
import { userState } from '../lib/firebaseAuth.js';

export const VerifyEmail = () => {
  const verifyDiv = document.createElement('div');
  const containerVerify = `
  <h2 id="checkEmailMsg" class="darkPurple">Your account has been created, <br> please check you email to continue.</h2>
  <button class="button" id="verifyBtn">I verified my email</button>
  <br>
  <p id="signUpMsg"></p>
  `;

  verifyDiv.innerHTML = containerVerify;

  const verifyBtn = verifyDiv.querySelector('#verifyBtn');
  const signUpMsg = verifyDiv.querySelector('#signUpMsg');

  verifyBtn.addEventListener('click', () => {
    userState((user) => {
      // const uid = user.uid;
      // const email = user.email;
      const emailVerified = user.emailVerified;
      if (emailVerified) {
        signUpMsg.textContent = `${user.email} Verified email`;
        onNavigate('/logIn');
      } else {
        signUpMsg.textContent = `${user.email} Unverified email`;
        window.location.reload();
      }
    });
  });
  return verifyDiv;
};

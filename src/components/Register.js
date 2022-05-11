/* eslint-disable import/no-cycle */
import {
  signUpEmail, verificationEmail, logInGoogle, logInFacebook, getUser,
} from '../lib/firebaseAuth.js';
import { onNavigate, checkEmail, checkPassword } from '../main.js';

export const Register = () => {
  const registerDiv = document.createElement('div');
  const containerRegister = `
  <main id="registerMain">
    <div class="top">
      <i class="icon-arrow-left2 darkPurple"></i>
      <figure class="containerTopLogo">
        <img src="images/logotype/Full-logo.png" alt="Binge Worthy logo" class="fullLogo">
      </figure>
    </div>
    <div id="containerRegister">
      <p class="purple w6 headerMsg">Register with email</p>
      <div class="container">
        <form action="" method="POST" class="form">
          <div class="formGroup">
            <input type="email" name="email" id="userEmail" placeholder="email" class="formItem">
            <label for="email" class="formLabel emailLabel">Email</label>
          </div>
          <div class="formGroup passwordGroup">
            <div>
              <input type="password" name="password" id="password" placeholder="password" class="formItem">
              <label for="password" class="formLabel">Password</label>
            </div>
            <div>
              <i class="icon-eye darkPurple" id="eyeLogo1" style="display: none;"></i>
              <i class="icon-eye-blocked darkPurple" id="eyeSlashLogo1"></i>
            </div>
          </div>
          <p id="passMsg"></p>
        </form>
      </div>
      <button class="button" id="createAccBtn">Create account</button>
      <p id="progressMsg"></p>
      <br>
      <div class="orContinueWith">
        <p class="purple">or</p>
        <div id="googleRegBtn" class="googleBtn">
          <img class="googleIcon" src="https://developers.google.com/identity/images/g-logo.png" alt="">
          <p class="buttonText w7">Continue with Google</p>
        </div>
        <div id="fbRegBtn" class="fbBtn">
          <img class="fbIcon" src="https://i0.wp.com/uncomocorreo.com/wp-content/uploads/2017/03/facebook-logo.png?resize=300%2C300&ssl=1" alt="">
          <p class="buttonText w7">Continue with Facebook</p>
        </div>
      </div>
    </div>
  </main>`;

  registerDiv.innerHTML = containerRegister;

  const createAccBtn = registerDiv.querySelector('#createAccBtn');
  const googleRegBtn = registerDiv.querySelector('#googleRegBtn');
  const email = registerDiv.querySelector('#userEmail');
  const password = registerDiv.querySelector('#password');
  const progressMsg = registerDiv.querySelector('#progressMsg');
  const passMsg = registerDiv.querySelector('#passMsg');

  email.addEventListener('keyup', () => {
    const validEmail = checkEmail(email.value);
    if (validEmail === false) {
      email.classList.add('invalid');
      email.classList.remove('valid');
    } else if (validEmail === true) {
      email.classList.add('valid');
      email.classList.remove('invalid');
    }
  });

  password.addEventListener('keyup', () => {
    const validPassword = checkPassword(password.value);
    if (validPassword === false) {
      password.classList.add('invalid');
      password.classList.remove('valid');
      passMsg.innerHTML = `The password must be between 8 and 15 characters long
      <br> uppercase letters and numbers are allowed.`;
    } else if (validPassword === true) {
      password.classList.add('valid');
      password.classList.remove('invalid');
      passMsg.innerText = '';
    }
  });

  const eye = registerDiv.querySelector('#eyeLogo1');
  const eyeSlash = registerDiv.querySelector('#eyeSlashLogo1');
  eyeSlash.addEventListener('click', () => {
    if (password.type === 'password') {
      password.type = 'text';
      eyeSlash.style.display = 'none';
      eye.style.display = '';
      if (eyeSlash.style.display === 'none') {
        eye.addEventListener('click', () => {
          password.type = 'password';
          eyeSlash.style.display = '';
          eye.style.display = 'none';
        });
      }
    }
  });

  createAccBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (checkEmail(email.value) && checkPassword(password.value)) {
      signUpEmail(email.value, password.value)
        .then((userCredential) => {
          const user = userCredential.user; // COMO PARAMETRO userCredential
          progressMsg.innerText = 'Your account is being created, please wait';
          getUser(user.uid)
            .then(() => {
            });
          verificationEmail()
            .then(() => {
              onNavigate('/verifyEmail');
            });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            progressMsg.innerText = 'Email already in use';
          }
        });
    } else {
      progressMsg.innerText = 'Wrong. Please, try again.';
    }
  });

  const backIcon = registerDiv.querySelector('.icon-arrow-left2');
  backIcon.addEventListener('click', () => {
    onNavigate('/');
  });

  googleRegBtn.addEventListener('click', () => {
    logInGoogle()
      .then(() => {
        onNavigate('/feed');
      });
  });

  const fbRegBtn = registerDiv.querySelector('#fbRegBtn');
  fbRegBtn.addEventListener('click', () => {
    logInFacebook()
      .then(() => {
        onNavigate('/feed');
      });
  });

  return registerDiv;
};

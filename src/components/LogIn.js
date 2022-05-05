/* eslint-disable import/no-cycle */
// eslint-disable-next-line import/newline-after-import
import {
  logInEmail,
  logInGoogle,
  logInFacebook,
} from '../lib/firebaseAuth.js';
import { onNavigate } from '../main.js';

export const LogIn = () => {
  const logInDiv = document.createElement('div');
  const containerLogIn = `
  <main id="loginMain">
    <div class="top">
      <i class="icon-arrow-left2 darkPurple"></i>
      <figure class="containerTopLogo">
        <img src="images/logotype/Full-logo.png" alt="Binge Worthy logo" class="fullLogo">
      </figure>
    </div>
    <div class="containerLogin">
      <p class="purple w6 meow">Log in with email</p>
      <div class="container">
        <form action="" method="POST" class="form">
          <div class="formGroup">
            <input type="email" name="email" id="userEmailLogIn" placeholder="email" class="formItem">
            <label class="formLabel emailLabel" for="email">Email</label>
          </div>
          <div class="formGroup passwordGroup">
            <div>
              <input type="password" name="password" id="passwordLogIn" placeholder="password" class="formItem">
              <label class="formLabel" for="password">Password</label>
            </div>
            <div>
              <i class="icon-eye darkPurple" id="eyeLogo1" style="display: none;"></i>
              <i class="icon-eye-blocked darkPurple" id="eyeSlashLogo1"></i>
            </div>
          </div>
          <div>
            <input type="button" id="logInBtn" value="Log in" class="button">
            <p id="logInMessage"></p>
          </div>
        </form>
        <div id="aDiv">
          <button class="pink link" id="forgotPass">I forgot my password</button>
        </div>
      </div>
      <div class="orContinueWith">
        <p class="purple">or</p>
        <div id="googleRegBtn" class="googleBtn">
          <img class="googleIcon" src="https://developers.google.com/identity/images/g-logo.png" alt="">
          <p class="buttonText w7">Continue with Google</p>
        </div>
        <div id="fbLogBtn" class="fbBtn">
          <img class="fbIcon" src="https://i0.wp.com/uncomocorreo.com/wp-content/uploads/2017/03/facebook-logo.png?resize=300%2C300&ssl=1" alt="">
          <p class="buttonText w7">Continue with Facebook</p>
        </div>
      </div>
    </div>
  </main>`;
  logInDiv.innerHTML = containerLogIn;
  const email = logInDiv.querySelector('#userEmailLogIn');
  const password = logInDiv.querySelector('#passwordLogIn');
  const logInBtn = logInDiv.querySelector('#logInBtn');
  const logInMsg = logInDiv.querySelector('#logInMessage');
  const googleRegBtn = logInDiv.querySelector('#googleRegBtn');
  const forgotPass = logInDiv.querySelector('#forgotPass');

  logInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logInEmail(email.value, password.value)
      .then(() => {
        console.log('cuentaaaaaaa creaddaaaaaaaaa');
        logInMsg.innerHTML = 'The user logged in';
        email.classList.add('valid');
        password.classList.add('valid');
        setTimeout(() => {
          onNavigate('/feed');
        }, 2000);
        console.log('mensaje de loginnnnnn', logInMsg);
      })
      .catch((error) => {
        console.log('entreeee al error');
        if (error.code === 'auth/user-not-found') {
          logInMsg.innerHTML = 'User not found';
          email.classList.add('invalid');
        } else if (error.code === 'auth/wrong-password') {
          logInMsg.innerHTML = 'Wrong password';
          password.classList.add('invalid');
        } else if (error.code === 'auth/internal-error') {
          logInMsg.innerHTML = 'Enter your password';
          password.classList.add('invalid');
        } else if (error.code === 'auth/invalid-email') {
          logInMsg.innerHTML = 'Enter a valid email';
          email.classList.add('invalid');
        } else {
          logInMsg.innerHTML = `${error.code}`;
        }
      });
  });

  forgotPass.addEventListener('click', () => {
    onNavigate('/resetPassword');
  });

  googleRegBtn.addEventListener('click', () => {
    logInGoogle()
      .then(() => {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
        onNavigate('/feed');
      });
  });
  /*       .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // const email = error.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error);
      });
  }); */

  const fbRegBtn = logInDiv.querySelector('#fbLogBtn');
  fbRegBtn.addEventListener('click', () => {
    logInFacebook()
      .then((result) => {
        // const user = result.user;
        console.log('facebook sign up', result);
        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        onNavigate('/feed');
      });
  });

  /* .catch((error) => {
        /* const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(error);
      });
  }); */

  const backIcon = logInDiv.querySelector('.icon-arrow-left2');
  backIcon.addEventListener('click', () => {
    onNavigate('/');
  });

  const eye = logInDiv.querySelector('#eyeLogo1');
  const eyeSlash = logInDiv.querySelector('#eyeSlashLogo1');
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
  return logInDiv;
};

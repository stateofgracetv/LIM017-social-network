/* eslint-disable import/no-cycle */
import { onNavigate } from '../main.js';

export const Home = () => {
  const homeDivs = document.createElement('div');
  const homeContainer = `
    <main id="homeMain">
      <aside id="desktopDesign" class="desktop">
        <figure>
          <img src="images/desktop/desktop-design.png" id="designImage">
        </figure>
      </aside>
      <section>
        <figure class="containerLogo">
          <img src="images/logotype/Logo-icon.png" alt="Binge Worthy logo" class="topLogo">
        </figure>
        <figure class="containerLogoLetters">
          <img src="images/logotype/Logo-letters-only.png" alt="Binge Worthy logo" class="appName">
          <p class="pink w7">MATCH WITH YOUR STORIES</p>
        </figure>
        <figure class="containerFullLogo desktop">
          <img src="images/logotype/Full-logo.png" alt="Binge Worthy logo" id="homeLogo">
          <p class="purple w7" id="desktopSlogan">MATCH WITH YOUR STORIES</p>
        </figure>
        <button id="signUpBtn" class="button">Create an account</button>
        <div id="goToLogin">
          <p>Already have an account?</p>
          <a id="goToLoginBtn" class="pink w5 link">Log in</a>
        </div>
      </section>
    </main>`;

  homeDivs.innerHTML = homeContainer;
  const createAccBtn = homeDivs.querySelector('#signUpBtn');
  createAccBtn.addEventListener('click', () => onNavigate('/register'));

  const goToLogin = homeDivs.querySelector('#goToLoginBtn');
  goToLogin.addEventListener('click', () => onNavigate('/logIn'));

  return homeDivs;
};

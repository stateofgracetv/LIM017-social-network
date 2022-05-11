/* eslint-disable import/no-cycle */
import { Home } from './components/Home.js';
import { Register } from './components/Register.js';
import { LogIn } from './components/LogIn.js';
import { VerifyEmail } from './components/VerifyEmail.js';
import { Feed } from './components/Feed.js';
import { ResetPassword } from './components/ResetPassword.js';

// Router
export const routes = {
  '/': Home,
  '/register': Register,
  '/logIn': LogIn,
  '/verifyEmail': VerifyEmail,
  '/feed': Feed,
  '/resetPassword': ResetPassword,
};

export const onNavigate = (pathname) => {
  const root = document.getElementById('root');
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  } return root.appendChild(routes[pathname]());
};

window.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;
  onNavigate(pathname);
});

export const checkEmail = (str) => {
  const emailPattern = /^([a-z\d.-_]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  if (!emailPattern.test(str)) {
    return false;
  } if (emailPattern.test(str)) {
    return true;
  }
  return checkEmail();
};

export const checkPassword = (str) => {
  const passwordPattern = /^[\d\w@-]{8,15}$/i;
  if (!passwordPattern.test(str)) {
    return false;
  } if (passwordPattern.test(str)) {
    return true;
  }
  return checkPassword();
};

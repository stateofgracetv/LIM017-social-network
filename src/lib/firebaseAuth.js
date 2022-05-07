/* eslint-disable import/no-duplicates */
/* eslint-disable max-len */
import { initializeApp } from './firebaseUtils.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from './firebaseUtils.js';

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  /* setDoc, */
  serverTimestamp,
  deleteDoc,
  where,
} from './firebaseUtils.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAI4wQttmvMp9hwAw5-gAe5X5q5DeRmnGg',
  authDomain: 'binge-worthy-94b1b.firebaseapp.com',
  projectId: 'binge-worthy-94b1b',
  storageBucket: 'binge-worthy-94b1b.appspot.com',
  messagingSenderId: '1051976335838',
  appId: '1:1051976335838:web:0a251fdbb4d71af2625d4f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gProvider = new GoogleAuthProvider();
const fProvider = new FacebookAuthProvider();
export const auth = getAuth(app);

export const signUpEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const verificationEmail = () => sendEmailVerification(auth.currentUser);
export const userState = (callback) => onAuthStateChanged(auth, callback);
export const logInEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logInGoogle = () => signInWithPopup(auth, gProvider);
export const logInFacebook = () => signInWithPopup(auth, fProvider);
export const recoverPasswordWithEmail = (email) => sendPasswordResetEmail(auth, email);
export const logOut = () => signOut(auth);

/** firebase */

// Función que devuelve datos del usuario:
export const getUserLocalStorage = () => JSON.parse(localStorage.getItem('user'));

export function removeLikes(docId, userId) {
  const removeLikePost = doc(db, 'posts', docId);
  return updateDoc(removeLikePost, {
    likes: arrayRemove(userId), // Aquí estamos borrando el id del user en el array Likes.
  });
}

// Funcion para añadir likes
export function addLikes(docId, userId) {
  const addLikePost = doc(db, 'posts', docId);
  return updateDoc(addLikePost, {
    likes: arrayUnion(userId), // Aquí estamos añadiendo el id del user en el array Likes.
  });
}

// Guardar post en FireStore
export const savePost = (post, tag) => addDoc(collection(db, 'posts'), {
  post: post.value,
  tag: tag.value,
  date: serverTimestamp(),
  likes: [],
});

// funcion que reconoce/escucha datos nuevos onSnapshot : en instantánea
export const onGetPost = (callback) => {
  const dataSort = query(collection(db, 'posts'), orderBy('date', 'desc'));
  return onSnapshot(dataSort, callback);
};
export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));

export const getDataWithFilters = (tag, callback) => {
  const dataSort = query(collection(db, 'posts'), where('tag', '==', tag));
  // console.log(tag);
  return onSnapshot(dataSort, callback);
};

// Obtener data un usuario de FireStore
export const getUser = (id) => {
  const docRefUsers = doc(db, 'users', id);
  return getDoc(docRefUsers);
};
// console.log(getUser);

export const getPost = (id) => getDoc(doc(db, 'posts', id));

export const updatePost = (id, editedFields) => updateDoc(doc(db, 'posts', id), editedFields);

/* Tiene un parametroooo vacíiiio
// Funcion que sube un nuevo array con los ids de los usuarios que han dado like a la publicacion
export function postLike(id, newArray) {
  return setDoc(doc(db, 'posts', id), { likes: newArray }, { merge: true });
}
// Funcion que obtiene el array de likes de una publicacion
export async function getArrayLikes(e) {
  const docSnap = await getDoc(doc(db, 'posts', e));
  // eslint-disable-next-line prefer-const
  let array = docSnap.data().likes;
  return array;
} */

/* export function postLike(id, newArray) {
  return setDoc(doc(db, 'posts', id), { likes: newArray }, { merge: true });
}
console.log('sooooy db', doc('posts'));

// Funcion que obtiene el array de likes de una publicacion
export async function getArrayLikes(e) {
  const docSnap = await getDoc(doc(db, 'posts', e));
  console.log('argumeeeentosss', db, 'posts');
  // eslint-disable-next-line prefer-const
  let array = docSnap.data().likes;
  return array;
}
console.log('SSSSSSSoy firebase auth en getArrayLikes', getArrayLikes(), postLike()); */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDCEs0CyIM82kkXJyPYC4kRRhtbWpvbx2Q',
  authDomain: 'erettsegi2027-9ddb8.firebaseapp.com',
  projectId: 'erettsegi2027-9ddb8',
  storageBucket: 'erettsegi2027-9ddb8.firebasestorage.app',
  messagingSenderId: '405374595532',
  appId: '1:405374595532:web:47707ff90368cf16d26d69',
  measurementId: 'G-GQHMQFVLTF'
};

const allowedEmails = new Set([
  'baricz.timea2006@gmail.com',
  'aaronzolnai@gmail.com'
]);
const auth = getAuth(initializeApp(firebaseConfig));
const gate = document.querySelector('#loginGate');
const loginButton = document.querySelector('#googleLogin');
const loginError = document.querySelector('#loginError');

function showGate(message = '') {
  gate.hidden = false;
  loginError.textContent = message;
}

function publishUser(user) {
  window.dispatchEvent(new CustomEvent('firebase-user-change', { detail: user }));
}

onAuthStateChanged(auth, async (user) => {
  const email = user?.email?.toLowerCase();
  if (user && !allowedEmails.has(email)) {
    await signOut(auth);
    publishUser(null);
    showGate('Ezzel az e-mail-címmel nincs hozzáférésed az alkalmazáshoz.');
    return;
  }
  if (user) {
    gate.hidden = true;
    publishUser(user);
  } else {
    publishUser(null);
    showGate();
  }
});

loginButton.addEventListener('click', async () => {
  loginError.textContent = '';
  loginButton.disabled = true;
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    loginError.textContent = error.code === 'auth/operation-not-allowed'
      ? 'A Firebase Console-ban előbb engedélyezd a Google bejelentkezést.'
      : 'A bejelentkezés nem sikerült. Próbáld újra.';
  } finally {
    loginButton.disabled = false;
  }
});

window.firebaseAuth = { signOut: () => signOut(auth) };

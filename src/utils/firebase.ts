import { initializeApp } from 'firebase/app';
import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env['REACT_APP_FIREBASE_API_KEY'],
  authDomain: process.env['REACT_APP_FIREBASE_AUTH_DOMAIN'],
  projectId: process.env['REACT_APP_FIREBASE_PROJECT_ID'],
  storageBucket: process.env['REACT_APP_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['REACT_APP_FIREBASE_MESSAGE_SEND_ID'],
  appId: process.env['REACT_APP_FIREBASE_APP_ID'],
  measurementId: process.env['REACT_APP_MEASUREMENT_ID'],
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const db = getFirestore(app);
export const auth = getAuth(app);

export const firebaseRegister = async (email: string, password: string) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      user && sendEmailVerification(user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { errorCode, errorMessage };
    });
};

// export const firebaseLogin = async (email: string, password: string) => {
//     const auth = getAuth();
//     return signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             // Signed in
//             const user = userCredential.user;
//             return user;
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             return { errorCode, errorMessage };
//         });
// };

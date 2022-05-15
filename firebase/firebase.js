import { initializeApp, getApps, getApp } from 'firebase/app';

import firebaseConfig from './config';

let firebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export default firebaseApp;

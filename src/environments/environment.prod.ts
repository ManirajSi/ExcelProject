// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDESkwu4S7pKw_I4bLMPIiD7htqUf8Qn1k',
    authDomain: 'excelendsite.firebaseapp.com',
    projectId: 'excelendsite',
    storageBucket: 'excelendsite.appspot.com',
    messagingSenderId: '694155650321',
    appId: '1:694155650321:web:e54e99382ad44bf640d8b0',
    measurementId: 'G-4HEYGL4QY4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const environment = {
    production: true,
    firebaseConfig: {
        apiKey: 'AIzaSyDESkwu4S7pKw_I4bLMPIiD7htqUf8Qn1k',
        authDomain: 'excelendsite.firebaseapp.com',
        projectId: 'excelendsite',
        storageBucket: 'excelendsite.appspot.com',
        messagingSenderId: '694155650321',
        appId: '1:694155650321:web:e54e99382ad44bf640d8b0',
        measurementId: 'G-4HEYGL4QY4',
    },
};

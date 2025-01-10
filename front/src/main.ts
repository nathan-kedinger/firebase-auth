import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.ts";

import {createPinia} from "pinia";

import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_VUE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_VUE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_VUE_APP_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);
const app = createApp(App)
const pinia = createPinia();

app.use(router)
    .use(pinia)
    .mount('#app')
//.use(auth)

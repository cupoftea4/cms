import { createApp } from 'vue';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import Vue3Toasity from 'vue3-toastify';
import router from './router';
import 'vue3-toastify/dist/index.css';

import './styles/global.scss';

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router);
app.use(Vue3Toasity, {
  limit: 2,
});

app.mount('#app');


// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js');
//   });
// }


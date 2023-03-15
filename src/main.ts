import { createApp } from 'vue';
import App from '@/App.vue';
import { createPinia } from 'pinia';

import router from './router';

import './styles/global.scss';

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router);

app.mount('#app');


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}


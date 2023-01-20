import './bootstrap';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';

import PrimeVue from 'primevue/config';

//import 'primevue/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primevue/resources/primevue.min.css';

import AdminLayout from '@/Layouts/Admin.vue';

createInertiaApp({

  title: (title) => `${ title ?? ' Starter' }`,

  resolve: (name) => {
    const page = require(`./Pages/${ name }`).default;
    page.layout = page.layout || AdminLayout;
    return page;
  },

    // @ts-ignore
  setup({ el, app, props, plugin }) {

    return createApp({ render: () => h(app, props) })
      .use(plugin)
      .use(PrimeVue, {ripple: true})
      .use(Toast, {
        transition: 'Vue-Toastification__slideBlurred',
        maxToasts: 10,
        newestOnTop: true
      })
      .mount(el)
    ;
  },
}).then(()=> {
  document.getElementById('app').removeAttribute('data-page');
});

InertiaProgress.init({ color: '#4B5563' });

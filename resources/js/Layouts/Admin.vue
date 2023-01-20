<template>

  <Head>
    <title> {{ appTitle }} </title>
  </Head>
  <!--  Header  -->
  <Header/>
  <!--  /Header  -->

  <!-- ======= Sidebar ======= -->
  <Sidebar :navigations="sidebar_navigation"/>
  <!-- End Sidebar-->

  <main id="main" class="main">

    <div class="pagetitle d-flex align-items-center justify-content-between">

      <h1 class="mb-4">{{ state.title }}</h1>

      <nav class="justify-content-end">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link
              :href="route('dashboard')"
              :disbled="route().current('dashboard')"
            >
              Dashboard
            </Link>
          </li>
          <li v-if="!route().current('dashboard')" class="breadcrumb-item active text-capitalize">
            {{ getCurrentRouteName() }}
          </li>
        </ol>
      </nav>
    </div><!-- End Page Title -->

    <section class="section">
      <slot/>
    </section>

  </main>
  <!-- End #main -->

  <!--  Footer -->
  <Footer/>
  <!--  /Footer -->
</template>

<script>
import Header from '@/Layouts/Shared/Header';
import Footer from '@/Layouts/Shared/Footer';
import Sidebar from '@/Layouts/Shared/Sidebar';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';
import 'boxicons/css/boxicons.min.css';
import '@/assets/css/style.css';

import { Head } from '@inertiajs/inertia-vue3';

import { reactive, provide, watch, computed } from 'vue';
import { useEmitter, useHelper, useNotify } from '@/Composables/composable';
import { Link } from '@inertiajs/inertia-vue3';

export default {

  name: 'Admin',

  components: { Sidebar, Footer, Header, Link, Head },

  props: {

    auth: {
      type: Object
    },

    toast: {
      type: [Object, null]
    },

    // eslint-disable-next-line vue/prop-name-casing
    sidebar_navigation: {
      type: Array
    }
  },

  setup(props) {

    const { bus } = useEmitter();
    const { notify } = useNotify();
    const { route } = useHelper();

    const state = reactive({
      title: 'Dashboard',
    });

    const updateSidebarState = (value) => {

      const body = document.querySelector('body');

      if (!value) {
        body.classList.add('toggle-sidebar');
        return;
      }

      body.classList.remove('toggle-sidebar');
    };

    const updateTitle = (title) => state.title = title;

    provide('route', route);
    provide('user', props.auth.user);
    provide('toggleSidebar', updateSidebarState);
    provide('updateTitle', updateTitle);

    bus.on('setTitle', updateTitle);

    const getCurrentRouteName = ()=> {
      const routeName = route().current().split('.');
      return routeName[0];
    };

    const appTitle = computed(()=> {
      return `${state.title} | Secure Password`;
    });

    watch(() => props.toast, (nv) => {

      if (!nv) {
        return;
      }

      notify(nv?.message, {type:  nv?.type});

    }, { immediate: true, deep: true });

    return {
      state,
      route,
      getCurrentRouteName,
      appTitle
    };
  }
};
</script>

<style scoped>

</style>

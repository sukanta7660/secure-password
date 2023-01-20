<template>
  <!-- ======= Header ======= -->
  <header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
      <a href="#" class="logo d-flex align-items-center">
        <img src="images.logo" alt="">
        <span class="d-none d-lg-block">Secure Password</span>
      </a>
      <i
        class="bi bi-list toggle-sidebar-btn"
        @click="toggleSidebarState"
      />
    </div>

    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">

        <li ref="profile" class="nav-item dropdown pe-3" @click="toggleProfileState">

          <a
            class="nav-link nav-profile d-flex align-items-center pe-0"
            :class="state.showProfileMenu ? 'show' : ''"
          >
            <img :src="images.profile" alt="Profile" class="rounded-circle">
            <span class="d-none d-md-block dropdown-toggle ps-2">{{ user.name }}</span>
          </a><!-- End Profile Iamge Icon -->

          <ul
            class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile"
            :class="state.showProfileMenu ? 'show profile-menu-shown' : ''"
          >
            <li class="dropdown-header">
              <h6>{{ user.name }}</h6>
              <span>{{ user.email }}</span>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <Link
                class="dropdown-item d-flex align-items-center"
                :href="route('profile')"
              >
                <i class="bi bi-person"/>
                <span>My Profile</span>
              </Link>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <Link
                class="dropdown-item d-flex align-items-center"
                :href="route('logout')"
                method="post"
                as="button"
              >
                <i class="bi bi-box-arrow-right"/>
                <span>Sign Out</span>
              </Link>
            </li>

          </ul><!-- End Profile Dropdown Items -->
        </li><!-- End Profile Nav -->

      </ul>
    </nav><!-- End Icons Navigation -->

  </header>
  <!-- End Header -->
</template>

<script>

import { inject, onMounted, reactive, ref } from 'vue';
import { Link } from '@inertiajs/inertia-vue3';
import { useHelper } from '@/Composables/composable';
import { onClickOutside } from '@vueuse/core';


export default {

  name: 'Header',
  components: {
    Link
  },

  setup(){

    const { route } = useHelper();

    const profile = ref(null);

    const state = reactive({
      isActiveSidebar: true,
      showProfileMenu: false
    });

    const toggleSidebar = inject('toggleSidebar');

    const toggleSidebarState = () => {
      state.isActiveSidebar = !state.isActiveSidebar;
      toggleSidebar(state.isActiveSidebar);
    };

    const toggleProfileState = ()=> {
      state.showProfileMenu = !state.showProfileMenu;
    };

    onClickOutside(profile, ()=> {
      if(state.showProfileMenu) {
        toggleProfileState();
      }
    });

    const user = inject('user');

    onMounted(()=> {
      toggleSidebar(state.isActiveSidebar);
    });

    return {
      toggleSidebarState,
      toggleProfileState,
      state,
      user,
      route,
      profile,
      images: {
        logo: require('@/assets/img/logo.png').default,
        profile: require('@/assets/img/profile-img.jpg').default,
        messages1: require('@/assets/img/messages-1.jpg').default,
        messages2: require('@/assets/img/messages-2.jpg').default,
        messages3: require('@/assets/img/messages-3.jpg').default,
      }
    };
  }
};
</script>

<style scoped>
.profile-menu-shown {
  position: absolute; inset: 0 0 auto auto; margin: 0; transform: translate3d(-16.5px, 38px, 0px);
}
</style>

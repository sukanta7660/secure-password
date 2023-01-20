<template>
  <li :class="{'nav-item' : !isGrouped }" v-bind="$attrs">
    <Link
      class="nav-link"
      :class="{'collapsed' : !state.isActive}"
      :href="route(link.link)"
    >
      <i v-if="link.icon" :class="link.icon"/>
      <span>{{ link.text }}</span>
    </Link>
  </li>
</template>

<script>

import { defineComponent, inject, onBeforeMount, reactive } from 'vue';
import { Link } from '@inertiajs/inertia-vue3';
import { useHelper } from '@/Composables/composable';
import { Inertia } from '@inertiajs/inertia';

export default defineComponent({

  name: 'NavItem',

  components: { Link },
  inheritAttrs: false,

  props: {
    link: {
      type: Object,
      required: true
    },

    activeOn: {
      type: [String, Array]
    }
  },

  setup(props){

    const { isCurrentRoute, route } = useHelper();

    const state = reactive({
      isActive: isCurrentRoute(props.link.link)
    });

    const isGrouped = inject('is-grouped', false);

    const updateActiveRoute = () => {

      if(typeof props.activeOn === 'undefined') {
        state.isActive = isCurrentRoute(props.link.link);
        return;
      }

      if(typeof props.activeOn === 'string') {
        state.isActive = isCurrentRoute(props.activeOn);
        return;
      }

      if(!Array.isArray(props.activeOn)) {
        state.isActive = false;
        return;
      }

      let isActive = false;

      props.activeOn.forEach((item) => {

        if(isCurrentRoute(item)) {
          isActive = true;
        }
      });

      state.isActive = isActive;
    };

    const addToGroup = inject('add-to-group', undefined);

    onBeforeMount(()=> {

      if(typeof addToGroup !== 'function') {
        return;
      }

      const item = {
        ...props.link,
        activeOn: props.activeOn
      };

      return addToGroup(item);
    });

    Inertia.on('navigate', ()=> updateActiveRoute());

    return {
      state,
      updateActiveRoute,
      route,
      isGrouped
    };
  }
});
</script>

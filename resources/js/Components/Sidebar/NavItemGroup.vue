<template>
  <li class="nav-item">
    <a
      class="nav-link"
      :class="{'collapsed' : !state.isOpen}"
      @click="updateIsOpen(!state.isOpen)"
    >
      <i v-if="icon" :class="icon"/>
      <span>{{ name }}</span>
      <i class="bi bi-chevron-down ms-auto"/>
    </a>
    <ul class="nav-content collapse" :class="{'show':state.isOpen }">
      <slot/>
    </ul>
  </li>
</template>

<script>
import { provide, reactive } from 'vue';
import { useHelper } from '@/Composables/composable';
import { Inertia } from '@inertiajs/inertia';

export default {
  name: 'NavItemGroup',
  props: {

    name: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: false
    },
  },

  setup() {

    const { isCurrentRoute } = useHelper();

    const state = reactive({
      isOpen: false,
      items: [],
    });

    const updateIsOpen = (value) => {
      state.isOpen = value;
    };

    const addSubItems = (items)=> {
      return state.items.push(items);
    };

    function updateActiveState(){

      if(!state.items.length) {
        return;
      }

      let isActive = false;

      state.items.forEach((item) => {
        if(isCurrentRoute(item.link)) {
          isActive = true;
        }
      });

      state.isOpen = isActive;
    }

    Inertia.on('navigate', ()=> updateActiveState());

    provide('is-grouped', true);
    provide('add-to-group', addSubItems);

    return {
      state,
      updateIsOpen
    };
  }
};
</script>

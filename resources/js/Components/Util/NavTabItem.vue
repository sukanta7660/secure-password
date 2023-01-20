<template>
  <div class="tab-pane fade" :class="state.active ? 'show active' : ''">
    <slot v-if="state.active" />
  </div>
</template>

<script>
import { defineComponent, inject, onMounted, reactive, watch } from 'vue';

export default defineComponent({
  name: 'NavTabItem',

  props: {

    label: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true
    }
  },

  setup(props){

    const state = reactive({
      active: false,
      item: {
        label: '',
        name: ''
      }
    });

    const addToList = inject('add-to-tab');
    const active = inject('active');

    const updateActive = ()=> {
      state.active = props.name === active.value;
    };

    watch(active, () => {
      return updateActive();
    }, {
      immediate: true
    });

    onMounted(()=> {
      state.item.name = props.name;
      state.item.label = props.label;
      return addToList(state.item);
    });

    return {
      state,
      active
    };
  }
});
</script>

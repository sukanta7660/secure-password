<template>
  <div class="card">
    <div class="card-body pt-5">
      <ImageInput
        v-model="state.image"
        can-clear
        show-preview
      />
    </div>
  </div>
</template>

<script>

import ImageInput from '@/Components/ImageInput';
import { reactive, defineComponent } from 'vue';
import {useHelper} from '@/Composables/composable';

export default defineComponent({

  name: 'Dashboard',

  components: { ImageInput },

  setup(props) {
    const { setPageTitle, route } = useHelper();

    const state = reactive({
      image: null
    });

    setPageTitle('Dashboard');

    return {
      state
    };
  }
});
</script>

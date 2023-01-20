<template>

  <ul class="nav nav-tabs nav-tabs-bordered">

    <li
      v-for="(item, index) in state.items"
      :key="`nav-tab-${index}`"
      class="nav-item"
      @click="updateActive(item.name)"
    >
      <button
        class="nav-link"
        :class="activeKey === item.name ? 'active' : ''"
      >
        {{ item.label }}
      </button>
    </li>

  </ul>

  <div class="tab-content">
    <slot/>
  </div>

</template>

<script>
import { provide, reactive, defineComponent, ref, onMounted } from 'vue';
export default defineComponent({
  name: 'NavTabs',
  setup(){

    const state = reactive({
      items: [],
    });

    const activeKey = ref(null);

    const updateState = (item) => {

      if(!state.items.length) {
        return state.items.push(item);
      }

      let hasMatch = false;

      state.items.forEach((itm) => {

        if(itm.name === item.name) {
          hasMatch = true;
        }
      });

      if(hasMatch) {
        return;
      }

      state.items.push(item);

    };

    const updateActive = (key) =>  activeKey.value = key;

    function mounted(){

      if(state.items.length) {
        activeKey.value = state.items[0]['name'];
      }

    }

    onMounted(mounted);

    provide('add-to-tab', updateState);
    provide('active', activeKey);

    return {
      state,
      updateActive,
      activeKey
    };
  }
});
</script>

<template>
  <div v-bind="containerAttrs">
    <label
      v-if="!!label"
      v-bind="labelAttrs"
    >
      {{ label }}</label>
    <input
      v-model="value"
      v-bind="inputAttrs"
    >
  </div>
</template>

<script>
import { computed } from 'vue';
import { getAttribute } from '@/Plugins/FormBuilder/Util/helper';

export default {

  name: 'TextInput',
  inheritAttrs: false,

  props: {
    modelValue: {
      type: [String, Number]
    },

  },
  setup(props, { emit, attrs }) {

    const value = computed({

      get() {
        return props.modelValue;
      },

      set(value) {
        emit('update:modelValue', value);
      },
    });

    const { containerAttrs, inputAttrs, labelAttrs } = getAttribute(attrs, 'bootstrap');
    const label = attrs.label ?? null;

    return {
      containerAttrs, inputAttrs, labelAttrs, value, label
    };
  }
};
</script>

<style scoped>

</style>

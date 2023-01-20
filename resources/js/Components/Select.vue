<template>
  <label v-if="!!label" class="form-label" :for="id"> {{ label }} </label>
  <select v-bind="$attrs" :id="id" v-model="value" class="form-select">
    <option
      v-for="(item, index) in selectOptions"
      v-if="selectOptions.length"
      :key="`select-${index}`"
      :value="item.value"
      :selected="item.selected"
    >
      {{ item.key }}
    </option>
    <option v-else disabled>No Options</option>
  </select>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { uid } from '@/util/helper';

export default defineComponent({
  name: 'Select',
  inheritAttrs: false,
  props: {

    label: {
      type: String
    },

    options: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String,
    },
  },

  setup(props, { emit }) {

    const id = computed(() => `input-${ uid() }`);

    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });

    const selectOptions = computed(() => {

      const options = [...props.options];

      let validOptions = [];

      options.forEach((item) => {

        if (typeof item === 'string') {

          validOptions.push({
            key: item,
            value: item,
            selected: false
          });
        }
      });

      return validOptions;

    });

    return {
      id,
      value,
      selectOptions
    };
  }
});
</script>

<style scoped>

</style>

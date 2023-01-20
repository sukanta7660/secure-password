<template>
  <div class="form-check" :class="{'form-check-inline' : inline}">

    <input
      :id="id"
      v-model="dataValue"
      class="form-check-input"
      :class="{'is-invalid' : !!error}"
      type="radio"
      :value="value"
      v-bind="$attrs"
    >

    <label
      v-if="!!radioLabel"
      class="form-check-label"
      :for="id"
    >
      {{ radioLabel }}
    </label>
    <div v-if="error" class="invalid-feedback"> {{ error }}</div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { uid } from '@/util/helper';

export default {
  name: 'RadioInput',
  inheritAttrs: false,
  props: {

    modelValue: {
      type: [Boolean, String]
    },

    inline: {
      type: Boolean,
      default: false
    },

    label: {
      type: String
    },

    value: {
      type: [String, Boolean],
      required: true
    },
    error: {
      type: String
    }
  },
  setup(props, { emit }) {

    const dataValue = computed({

      get() {
        return props.modelValue;
      },

      set(value) {
        return emit('update:modelValue', value);
      }
    });

    const radioLabel = computed(() => {
      return props.label ?? props.value;
    });

    const id = computed(() => `input-${ uid() }`);

    return {
      dataValue,
      radioLabel,
      id
    };
  }
};
</script>

<style scoped>

</style>

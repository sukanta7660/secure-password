<template>
  <slot name="label">
    <label
      v-if="label" :for="id"
      class="form-label"
    >
      {{ label }}
    </label>
  </slot>
  <textarea
    :id="id"
    v-model="value"
    class="form-control"
    :class="{'is-invalid' : !!error}"
    v-bind="$attrs"
  />
  <div v-if="error" class="invalid-feedback"> {{ error }}</div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { uid } from '@/util/helper';

export default defineComponent({
  name: 'TextArea',
  inheritAttrs: false,

  props: {

    modelValue: {
      type: String
    },

    label: {
      type: String,
    },
    error: {
      type: String
    }
  },

  setup(props, { emit }) {

    const value = computed({

      get() {
        return props.modelValue;
      },

      set(value) {
        return emit('update:modelValue', value);
      }
    });

    const id = computed(() => `input-${ uid() }`);

    return {
      id, value
    };
  }
});
</script>

<template>
  <div
    class="form-check checkbox g-1"
    :class="isSwitch ? 'form-switch' : ''"
  >
    <input
      :id="state.uniqueID"
      v-model="state.value"
      class="form-check-input"
      :class="{'is-invalid' : !!error}"
      type="checkbox"
      value="true"
      :checked="state.value"
      v-bind="$attrs"
    >
    <label
      v-if="label"
      class="form-check-label"
      :for="state.uniqueID"
    >
      {{ checkboxLabel }}
    </label>
    <div v-if="error" class="invalid-feedback"> {{ error }}</div>
  </div>
</template>

<script>

import { computed, defineComponent, reactive, watch } from 'vue';
import { uid } from '@/util/helper';

export default defineComponent({
  name: 'Checkbox',

  inheritAttrs: false,

  props: {

    label: String,

    modelValue: {
      type: Boolean
    },

    isSwitch: {
      type: Boolean,
      default: false
    },

    trueValue: {
      type: [String, Boolean, Number],
      default: true
    },

    falseValue: {
      type: [String, Boolean, Number],
      default: false
    },

    value: {
      required: false
    },

    labelOptions: {
      type: Array,
      default: ()=> []
    },

    error: {
      type: String,
    }
  },

  setup(props, { emit }) {

    const state = reactive({

      uniqueID: computed(() => `input-${ uid() }`),

      value: computed({

        get() {
          return props.modelValue;
        },

        set(value) {
          const checkBoxValue = value ? props.trueValue : props.falseValue;
          emit('update:modelValue', checkBoxValue);
        }
      })
    });

    watch(()=> props.value, (nv) => {

      if(typeof nv !== 'boolean') {
        state.value.value = false;
        return;
      }

      state.value.value = nv;
    });

    const checkboxLabel = computed(()=> {

      if(props.label) {
        return  props.label;
      }

      if(!props.labelOptions.length) {
        return props.label;
      }

      if(!props.labelOptions.length > 0) {
        return props.label;
      }

      if(state.value) {
        return props.labelOptions[0];
      }

      return props.labelOptions[1];
    });

    return {
      state,
      checkboxLabel
    };
  }
});
</script>

<template>
  <button
    :type="type"
    :class="state.buttonClasses"
    :disabled="disabled || state.loading"
    v-bind="$attrs"
  >
    <span
      v-if="state.loading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    />
    <i v-if="(!!icon) && !state.loading" :class="`${icon}`"/>
    <slot><span v-if="!!text" :class="{'me-1' : !!icon}">{{ text }}</span></slot>
  </button>
</template>
<script>

import { computed, defineComponent, reactive, watch } from 'vue';

export default defineComponent({

  name: 'Button',

  inheritAttrs: false,

  props: {

    type: {
      type: String,
      default: 'submit'
    },

    icon: {
      type: String,
    },

    text: {
      type: String
    },

    size: {

      type: String,

      validator(value) {

        const acceptableSize = ['sm', 'normal', 'lg'];

        if (acceptableSize.includes(value)) {
          return true;
        }

        throw new Error(`Invalid Size ${ value }. acceptable size ${ acceptableSize }`);
      },
      default: 'normal'
    },

    color: {

      type: String,

      validator(value) {
        const acceptableColorType = [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'light',
          'dark',
          'info'
        ];

        if (acceptableColorType.includes(value)) {
          return true;
        }

        throw new Error(`Invalid Color ${ value }. acceptable Color ${ acceptableColorType }`);
      }
    },

    outlined: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {

    const state = reactive({

      buttonClasses: computed(() => {
        return `btn ${ getButtonColor() } ${ getButtonSize() }`;
      }),

      loading: false,
    });

    function getButtonColor() {

      if (!props.color) {
        return '';
      }

      return `btn-${ props.outlined ? 'outline-' : '' }${ props.color }`;
    }

    function getButtonSize() {

      if (props.size === 'normal') {
        return '';
      }

      return `btn-${ props.size }`;
    }

    watch(() => props.loading, (newValue) => {
      state.loading = newValue;
    }, { immediate: true });

    return {
      state
    };
  }
});
</script>

<template>
  <span class="badge pe-1 ps-1 pt-1 pb-1" :class="`bg-${type} ${pill ? 'rounded-pill' : ''}`">
    <slot><span v-html="$attrs.value"/></slot>
  </span>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Badge',
  inheritAttrs: false,

  props: {

    type: {
      type: String,
      default: 'primary',
      validator(value) {
        const acceptableTypes = [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
          'light',
          'dark'
        ];

        return acceptableTypes.includes(value);
      }
    },

    pill: {
      type: Boolean,
      default: false
    }
  }
});
</script>

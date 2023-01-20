<template>
  <div
    v-if="message"
    :class="`alert alert-${type}`"
    role="alert"
  >
    <slot name="title"/>

    <slot> {{ message }} </slot>

    <template v-if="slots.footer">
      <hr>

      <slot name="footer"/>

    </template>
  </div>
</template>

<script>
import { useSlots } from 'vue';

export default {
  name: 'Alert',
  props: {
    type: {

      type: String,

      default: 'info',

      validator(value) {
        const acceptableProps = [
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
          'light',
          'dark',
        ];

        if (acceptableProps.includes(value)) {
          return true;
        }

        throw new Error(`Invalid type ${ value }. valid type ${ acceptableProps }`);
      }
    },

    message: {
      type: String
    }
  },
  setup(){

    const slots = useSlots();

    return {
      slots
    };
  }
};
</script>

<style scoped>

</style>

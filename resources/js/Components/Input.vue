<template>
  <label v-if="label" :for="state.uniqueID" class="form-label">{{ label }}</label>
  <div class="input-group">
    <i v-if="!!prependIcon" :class="`${prependIcon} input-group-text`"/>
    <slot v-else name="prepend"/>

    <input
      :id="state.uniqueID"
      :type="type"
      :class="state.inputClasses"
      :required="required"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    >

    <i
      v-if="state.showClearButton"
      :class="`${getIcon('clear')}
            input-group-text cursor-pointer`"
      @click="handleClear"
    />
    <i v-if="!!appendIcon" :class="`${appendIcon}`"/>

    <slot v-else name="append"/>
    <div v-if="error" class="invalid-feedback"> {{ error }}</div>

  </div>

  <small
    v-if="helpText"
    :id="`${state.uniqueID}-help-block`"
    class="form-text text-muted"
  >
    {{ helpText }}
  </small>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { getIcon, uid } from '@/util/helper';

export default defineComponent({
  inheritAttrs: false,
  expose: ['click', 'focus', 'blur'],

  props: {

    modelValue: {
      type: [String, Number]
    },

    required: {
      type: Boolean,
      default: false
    },

    label: {
      type: String,
    },

    error: {
      type: String,
    },

    helpText: {
      type: String
    },

    type: {
      type: String,
      default: 'text',

      validator(value) {

        const acceptableType = ['text', 'number', 'email', 'password', 'file'];

        if (acceptableType.includes(value)) {
          return true;
        }

        throw new Error(`invalid input type ${ value }. valid type is ${ acceptableType }`);
      }
    },

    prependIcon: {
      type: String,
    },

    appendIcon: {
      type: String,
    },

    showClear: {
      type: Boolean,
      default: false
    },

    onClear: {
      type: Function,
      default: () => ({})
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {

    const state = reactive({

      uniqueID: computed(() => `input-${ uid() }`),

      inputClasses: computed(() => {

        let classes = 'form-control';

        if (props.error) {
          classes += ' is-invalid';
        }

        return classes;
      }),

      showClearButton: computed(() => {

        if (!props.showClear) {
          return false;
        }

        if (!props.modelValue) {
          return false;
        }

        return true;
      })
    });

    const handleClear = () => {

      emit('update:modelValue', '');

      if (typeof props.onClear === 'function') {
        props.onClear();
      }
    };

    return {
      state,
      getIcon,
      handleClear
    };
  }
});
</script>

<style lang="scss">
.cursor-pointer {
    cursor: pointer;
}
</style>

<template>
  <Component
    :is="ImageInput"
    v-model="dataValue"
    label="Upload Video"
    :accept="accept"
    v-bind="$attrs"
    :error="error"
    can-clear
    @select="handleValueUpdate"
  >
    <template #preview="{ files }">
      <div v-if="files.length" class="embed-responsive mt-3">
        <video
          class="embed-responsive-item w-100"
          :src="files[0].preview"
          width="950"
          controls
        />
      </div>
    </template>
  </Component>
</template>

<script>
import { computed, defineComponent, watch } from 'vue';
import ImageInput from './ImageInput';

export default defineComponent({
  name: 'VideoInput',
  extends: ImageInput,
  inheritAttrs: false,

  props: {

    ...ImageInput.props,

    accept: {
      type: String,
      default: 'video/*'
    }
  },
  emits: [...ImageInput.emits],

  setup(props, context) {

    let dataValue = computed({
      get: () => props.modelValue,
      set: (value) => context.emit('update:modelValue', value)
    });

    const handleValueUpdate = (value) => (dataValue.value = value);

    watch(() => dataValue.value, (nv) => context
      .emit('update:modelValue', nv), { immediate: true });

    return {
      ImageInput,
      dataValue,
      handleValueUpdate,
      ...ImageInput.setup(props, context)
    };
  }
});
</script>

<style scoped>

</style>

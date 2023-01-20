import { ref, watch } from 'vue';

/**
 * @param props <Prop>
 * @param context <Context>
 * @returns {{dataValue: null, updateModelValue: (function(*): *)}}
 */

export function useModelValue(props, context) {

  const dataValue = ref(null);

  const emit = (event, value) => context.emit(event, value);

  const updateModelValue = (value) => dataValue.value = value;

  const watcherConfig = {
    immediate: true
  };

  watch(() => props.modelValue, (nv) => updateModelValue(nv), watcherConfig);

  watch(dataValue, (nv) => emit('update:modelValue', nv), watcherConfig);

  return {
    dataValue,
    updateModelValue
  };
}

<script>
import Multiselect from '@vueform/multiselect';
import { defineComponent } from 'vue';
import '@vueform/multiselect/themes/default.css';

export default defineComponent({
  name: 'Select',
  extends: Multiselect,
  props: {
    ...Multiselect.props
  },
  emits: [
    ...Multiselect.emits,
  ],
  setup(props, context) {
    return {
      ...Multiselect.setup(props, context)
    };
  }
});
</script>


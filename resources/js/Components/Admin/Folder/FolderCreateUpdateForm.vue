<template>
  <Modal
    v-model="state.modelState"
    :title="state.modalTitle"
    :confirm-button-loading="form.processing"
    :on-confirm="handleSave"
    persistent
    @close="$emit('close')"
  >
    <div class="row">

      <div class="col-12 mb-3">
        <Input
          v-model="form.name"
          label="Name"
          :error="form.errors.name"
        />
      </div>

    </div>
  </Modal>
</template>

<script>
import { resolveDeps, useHelper, useModelValue } from '@/Composables/composable';
import { useForm } from '@inertiajs/inertia-vue3';
import { computed, reactive, watch } from 'vue';
import Modal from '@/Components/Util/Modal';
import Input from '@/Components/Input';
import { isEmpty } from 'lodash';

export default {
  name: 'FolderCreateUpdateAction',

  components: { Input, Modal },

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    value: {
      type: Boolean,
      default: false
    },

    folder: {
      type: Object,
    }
  },

  setup(props, { emit }) {

    const { route } = useHelper();

    const state = reactive({
      ...resolveDeps([useModelValue]),
      isUpdating: false,
      modalTitle: computed(() => state.isUpdating ? 'Update Folder Name' : 'Create Folder'),
    });

    const form = useForm({
      id: null,
      name: '',
    });

    const handleSave = () => {

      if (state.isUpdating) {
        return updateFolder();
      }

      return createFolder();
    };

    function handleError() {
      state.updateModelState(true);
    }

    function handleSuccess() {
      state.updateModelState(false);
    }

    function createFolder() {
      return form.post(route('folder.store'), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    function updateFolder() {
      return form.patch(route('folder.update', form.id), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    function populateForm(value) {
      form.id = value.id;
      form.name = value.name;
    }

    watch(() => props.folder, (newValue) => {

      if (!isEmpty(newValue)) {
        state.isUpdating = true;
        return populateForm(newValue);
      }

      state.isUpdating = false;
    });

    return {
      state,
      form,
      handleSave
    };
  }
};
</script>

<style scoped>

</style>


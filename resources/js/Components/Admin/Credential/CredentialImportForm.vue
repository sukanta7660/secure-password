<template>
  <Modal
    v-model="state.modelState"
    :title="state.modalTitle"
    confirm-button-text="Import credential"
    :confirm-button-loading="form.processing"
    :on-confirm="handleImport"
    persistent
    @close="$emit('close')"
  >
    <div class="row">
      <div class="col-12 mb-3">
        <label class="mb-2">Choose File (CSV)</label>
        <input
          class="form-control"
          type="file"
          ref="upload"
          @change="handleFileChange"
          accept=".csv" />
        <div
          v-if="form.errors.file"
          class="invalid-feedback">
          {{ form.errors.file }}
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { resolveDeps, useHelper, useModelValue } from '@/Composables/composable';
import { useForm } from '@inertiajs/inertia-vue3';
import { reactive, ref } from 'vue';
import Modal from '@/Components/Util/Modal';

export default {
  name: 'CredentialImportForm',

  components: { Modal },

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    value: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {

    const { route } = useHelper();

    const state = reactive({
      ...resolveDeps([useModelValue]),
      isImporting: true,
      modalTitle: 'Import Credentials',
    });

    const upload = ref(null);

    let form = useForm({
      file: upload.value,
    });

    const handleImport = () => {

      if (state.isImporting) {
        return importCredential();
      }
    };

    const handleFileChange = (e) => {
      upload.value = e.target.files[0];
      form.file = upload.value;
    };

    function handleError() {
      state.updateModelState(true);
    }

    function handleSuccess() {
      form.reset('file');
      state.updateModelState(false);
    }

    function importCredential() {
      const formData = new FormData();
      formData.append('file', upload);
      return form.post(route('credential.import.csv'), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    return {
      state,
      form,
      upload,
      handleFileChange,
      handleImport
    };
  }
};
</script>

<style scoped>

</style>




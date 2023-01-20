<template>
  <Modal
    v-model="state.modelState"
    :title="state.modalTitle"
    confirm-button-text="Move Credential"
    :confirm-button-loading="form.processing"
    :on-confirm="handleMove"
    persistent
    @close="$emit('close')"
  >
    <div class="row">
      <div class="col-12 mb-3">
        <label class="mb-2">Move To</label>
        <select class="form-select" v-model="form.folder">
          <option :value="null">No Folder</option>
          <option
            v-for="(option, index) in folders"
            :value="option.id"
            :key="'folder' + index"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
  </Modal>
</template>

<script>
import { resolveDeps, useHelper, useModelValue } from '@/Composables/composable';
import { useForm } from '@inertiajs/inertia-vue3';
import { reactive, watch } from 'vue';
import Modal from '@/Components/Util/Modal';

export default {
  name: 'CredentialMoveForm',

  components: {Modal },

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    value: {
      type: Boolean,
      default: false
    },

    folders: {
      type: Array,
    },
    credentials: {
      type: Array,
    }
  },

  emits: ['moved'],

  setup(props, { emit }) {

    const { route } = useHelper();

    const state = reactive({
      ...resolveDeps([useModelValue]),
      isUpdating: false,
      modalTitle: 'Move Items',
    });

    let form = useForm({
      id: null,
      credentials: null,
      folder: null,
    });

    const handleMove = () => {

      if (state.isMoving) {
        return moveCredential();
      }
    };

    function handleError() {
      state.updateModelState(true);
    }

    function handleSuccess() {
      form.reset('folder');
      emit('moved', true)
      state.updateModelState(false);
    }

    function moveCredential() {
      return form.post(route('credential.move'), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    function populateForm(value) {
      form.credentials = value
    }

    watch(() => props.credentials, (newValue) => {

      if (newValue.length) {
        state.isMoving = true;
        return populateForm(newValue);
      }

      state.isMoving = false;
    });

    return {
      state,
      form,
      handleMove
    };
  }
};
</script>

<style scoped>

</style>




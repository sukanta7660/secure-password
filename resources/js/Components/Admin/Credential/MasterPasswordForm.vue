<template>
  <Modal
    v-model="state.modelState"
    :title="state.modalTitle"
    confirm-button-text="Master Password Confirm"
    :confirm-button-loading="form.processing"
    :on-confirm="handleCheck"
    persistent
    @close="$emit('close')"
  >
    <div class="row">
      <div class="col-12 mb-3">
        <Input
          v-model="form.masterPassword"
          type="password"
          label="Master Password"
          :error="form.errors.masterPassword"
        />
      </div>
    </div>
  </Modal>
</template>

<script>
import { resolveDeps, useHelper, useModelValue } from '@/Composables/composable';
import { useForm } from '@inertiajs/inertia-vue3';
import { reactive, watch } from 'vue';
import Modal from '@/Components/Util/Modal';
import Input from '@/Components/Input';

export default {
  name: 'MasterPasswordForm',

  components: { Modal, Input },

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

  emits: ['checked'],

  setup(props, { emit }) {

    const { route } = useHelper();

    const state = reactive({
      ...resolveDeps([useModelValue]),
      isChecking: true,
      modalTitle: 'Check Master Password',
    });

    let form = useForm({
      id: null,
      masterPassword: null,
    });

    const handleCheck = () => {
      if (state.isChecking) {
        return checkMasterPassword();
      }
    };

    function handleError() {
      state.updateModelState(true);
    }

    function handleSuccess() {
      form.reset('masterPassword');
      emit('checked', true)
      state.updateModelState(false);
    }

    function checkMasterPassword() {
      return form.post(route('check.password'), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    return {
      state,
      form,
      handleCheck
    };
  }
};
</script>

<style scoped>

</style>




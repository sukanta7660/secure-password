<template>
  <Modal
    v-model="state.modelState"
    :title="state.modalTitle"
    :confirm-button-text="state.isUpdating ? 'Update Credential' : 'Create Credential'"
    :confirm-button-loading="form.processing"
    :on-confirm="handleSave"
    persistent
    @close="$emit('close')"
  >
    <div class="row">

      <div class="col-12 mb-3">
        <label class="mb-2">What type of item is this?</label>
        <select class="form-select" v-model="form.type">
          <option
            v-for="(option, index) in state.credentialTypes"
            :value="option.value"
            :key="'type' + index"
          >
            {{ option.key }}
          </option>
        </select>
      </div>

      <div class="col-6 mb-3">
        <Input
          v-model="form.name"
          label="Name"
          :error="form.errors.name"
        />
      </div>
      <div class="col-6 mb-3">
        <label class="mb-2">Folder</label>
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

      <div class="col-6 mb-3">
        <Input
          v-model="form.username"
          label="Username"
          :error="form.errors.username"
        />
      </div>

      <div class="col-6 mb-3">
        <Input
          type="password"
          v-model="form.password"
          label="Password"
          :error="form.errors.password"
        />
      </div>

      <div class="col-12 mb-3">
        <Input
          v-model="form.url"
          label="URL"
          :error="form.errors.url"
        />
      </div>

      <div class="col-12 mb-3">
        <TextArea
          v-model="form.notes"
          label="Notes"
          :error="form.errors.notes"
        />
      </div>

    </div>
  </Modal>
</template>

<script>
import { resolveDeps, useHelper, useModelValue } from '@/Composables/composable';
import { useForm } from '@inertiajs/inertia-vue3';
import {computed, onMounted, reactive, watch} from 'vue';
import Modal from '@/Components/Util/Modal';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { isEmpty } from 'lodash';
import TextInput from '@/Plugins/FormBuilder/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default {
  name: 'CredentialCreateUpdateForm',

  components: {TextArea, TextInput, Input, Select, Modal },

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
    credential: {
      type: Object,
    }
  },

  emits: ['createOrUpdated'],

  setup(props, { emit }) {

    const { route } = useHelper();

    const state = reactive({
      ...resolveDeps([useModelValue]),
      isUpdating: false,
      modalTitle: computed(() => state.isUpdating ? 'Update Credential' : 'Add New Credential'),
      credentialTypes: [
        {
          key: 'Login',
          value: 'login'
        }
      ]
    });

    let form = useForm({
      id: null,
      type: 'login',
      name: '',
      folder: null,
      username: '',
      password: '',
      url: '',
      notes: ''
    });

    const handleSave = () => {

      if (state.isUpdating) {
        return updateCredential();
      }

      return createCredential();
    };

    function handleError() {
      state.updateModelState(true);
    }

    function handleSuccess() {
      resetForm();
      state.updateModelState(false);
    }

    function createCredential() {
      return form.post(route('credential.store'), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    function updateCredential() {
      return form.patch(route('credential.update', form.id), {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }

    onMounted(() => {
      if (!state.isUpdating) {
        resetForm();
      }

    });

    function resetForm() {
      form.reset('id')
      form.reset('type')
      form.reset('folder')
      form.reset('name')
      form.reset('password')
      form.reset('username')
      form.reset('url')
      form.reset('notes')
    }

    function populateForm(value) {
      form.id = value.id;
      form.type = value.item_type;
      form.name = value.name;
      form.username = value.username;
      form.password = value.password;
      form.folder = value.folder_id;
      form.url = value.url;
      form.notes = value.notes;
    }

    watch(() => props.credential, (newValue) => {

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



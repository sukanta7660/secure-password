<template>
  <div class="card">
    <div class="card-body">

      <DataTable
        :column="state.columns"
        :items="credentials.data"
        :hideSearch="true"
        :paginator="credentials"
      >
        <template #header>
          <Button
            text="Add New Credential"
            color="primary"
            size="sm"
            class="export-btn"
            icon="bi bi-plus-circle-fill"
            @click="handleCreateCredential"/>
          <Button
            class="m-lg-2 export-btn"
            text="Export as CSV"
            color="info"
            size="sm"
            icon="bi bi-download"
            @click="handleExportCsv"/>
          <Button
            class="import-btn"
            text="Import CSV File"
            color="secondary"
            size="sm"
            icon="bi bi-upload"
            @click="handleImportCredential"/>
          <Button
            v-if="state.selectedItems.length"
            class="import-btn m-lg-2"
            text="Move selected item"
            color="warning"
            size="sm"
            icon="bi bi-arrows-move"
            @click="handleMoveCredential"/>
        </template>

        <template #check="{ row }">
          <input
            class="form-check-input"
            type="checkbox"
            :value="row"
            v-model="state.selectedItems">
        </template>

        <template #folder="{ row }">
          {{ row.folder ? row.folder.name : 'N/A'}}
        </template>

        <template #action="{ row }">

          <div class="d-flex gap-1 align-items-center justify-content-center">

            <Button
              v-bind="getActionButtonAttrs('edit')"
              @click="handleAction('edit', row)"
            />

            <Button
              v-bind="getActionButtonAttrs('delete')"
              @click="handleAction('delete', row)"
            />

          </div>
        </template>
      </DataTable>
    </div>
  </div>
  <CredentialCreateUpdateForm
    v-model="state.showCreateUpdate"
    :folders="folders"
    :credential="state.selectedField"
    @close="state.selectedField = {}"
    @createOrUpdated="resetFormData"
  />
  <CredentialMoveForm
    v-model="state.showItemMove"
    :folders="folders"
    :credentials="state.selectedItems"
    @moved="resetPageData"
  />
  <CredentialImportForm
    v-model="state.showItemImport"
  />

  <MasterPasswordForm
    v-model="state.showCheckPasswordAction"
    @checked="handleChecked"
  />
</template>

<script>

import CredentialCreateUpdateForm from '@/Components/Admin/Credential/CredentiaCreateUpdateForm';
import CredentialMoveForm from '@/Components/Admin/Credential/CredentialMoveForm';
import CredentialImportForm from '@/Components/Admin/Credential/CredentialImportForm';
import MasterPasswordForm from '@/Components/Admin/Credential/MasterPasswordForm';
import { confirmDelete, getActionButtonAttrs, exportCsv } from '@/util/helper';
import {useHelper, useNotify} from '@/Composables/composable';
import DataTable from '@/Components/Util/DataTable';
import { defineComponent, reactive, computed } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import Button from '@/Components/Button';
import CheckBox from '@/Components/Checkbox';
import Swal from 'sweetalert2';
import axios from 'axios';

export default defineComponent({

  name: 'Credentials',

  components: {
    CredentialCreateUpdateForm,
    CredentialMoveForm,
    CredentialImportForm,
    MasterPasswordForm,
    CheckBox,
    Button,
    DataTable
  },

  props: {

    credentials: [Array, Object],

    folders: [Array, Object],

    search: [String]
  },

  setup(props) {

    const { setPageTitle, route } = useHelper();
    const { notifySuccess, notifyWarning } = useNotify();

    setPageTitle('Credentials');

    const state = reactive({
      columns: [
        {
          key: 'check',
          label: 'Select'
        },
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'folder',
          label: 'Folder'
        },
        {
          key: 'action',
          label: 'Action',
          headerClass: 'text-center',
        }
      ],
      selectedItems: [],
      search: props.search,
      showCreateUpdate: false,
      showItemMove: false,
      showItemImport: false,
      showCheckPasswordAction: false,
      selectedField: {},
    });

    const resetPageData = () => {
      state.selectedItems = [];
    };

    const exportableData = computed(() => state.selectedItems.length ? state.selectedItems : props.credentials.data)

    const handleAction = async (action, data) => {

      state.selectedField = data;

      if (action === 'delete') {
        await confirmDeleteCredential();
      }

      if(action === 'edit') {
        state.showCheckPasswordAction = true;
      }
    };

    const handleCreateCredential = () => {
      state.selectedField = {};
      state.showCreateUpdate = true;
    };

    const handleChecked = () => {
      state.showCreateUpdate = true;
    };

    const handleMoveCredential = () => {
      state.showItemMove = true;
    };

    const handleImportCredential = () => {
      state.showItemImport = true;
    };

    const resetFormData = () => {
      state.selectedField = {};
    };

    const confirmDeleteCredential = () => {
      return Swal.fire({
        title: 'Master Password',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          return axios.post(route('check.password'), {masterPassword: password})
            .then(response => {
              return deleteCredential();
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: Master Password Not Correct`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      });
    };

    const handleExportCsv = () => {

      if (!exportableData.value.length) {
        notifyWarning('There is no data to export')
      }

      const data = exportableData.value.map(item => ({
          id: item.id,
          folder_id: item.folder_id,
          user_id: item.user_id,
          item_type: item.item_type,
          name: item.name,
          username: item.username,
          password: item.password,
          url: item.url,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at,
      }))

      let fileName = String('credentials-'+new Date().toLocaleString());

      exportCsv(data, fileName);
      state.selectedItems = [];
      notifySuccess('Data exported successfully');

    };

    function deleteCredential() {
      Inertia.delete(route('credential.delete', state.selectedField?.id), {
        onFinish: () => {
          state.selectedField = {};
        }
      });
    }

    return {
      state,
      handleCreateCredential,
      handleMoveCredential,
      handleImportCredential,
      handleAction,
      resetPageData,
      handleExportCsv,
      resetFormData,
      handleChecked,
      exportCsv,
      getActionButtonAttrs
    };
  }
});
</script>

<style lang="scss">
.export-btn i, .import-btn i {
  margin-right: 7px !important;
}
</style>

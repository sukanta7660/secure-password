<template>
  <div class="card">
    <div class="card-body">

      <DataTable
        :column="state.columns"
        :items="folders.data"
        :hideSearch="true"
        :paginator="folders"
      >
        <template #header>
          <Button text="Add Folder" color="primary" size="sm" @click="handleCreateFolder"/>
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
  <FolderCreateUpdateForm
    v-model="state.showCreateUpdate"
    :folder="state.selectedField"
    @close="state.selectedField = {}"
  />
</template>

<script>

import FolderCreateUpdateForm from '@/Components/Admin/Folder/FolderCreateUpdateForm';
import { confirmDelete, getActionButtonAttrs } from '@/util/helper';
import { useHelper } from '@/Composables/composable';
import DataTable from '@/Components/Util/DataTable';
import { defineComponent, reactive } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import Button from '@/Components/Button';

export default defineComponent({

  name: 'Folder',

  components: { FolderCreateUpdateForm, Button, DataTable },

  props: {

    folders: [Array, Object],

    search: [String]
  },

  setup(props) {

    const { setPageTitle, route } = useHelper();

    setPageTitle('Folder');

    const state = reactive({
      columns: [
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'action',
          label: 'Action',
          headerClass: 'text-center',
        }
      ],
      search: props.search,
      showCreateUpdate: false,
      selectedField: {}
    });

    const handleAction = async (action, data) => {

      state.selectedField = data;

      if (action === 'delete') {
        return await confirmDelete({ onConfirm: deleteUser });
      }

      if(action === 'edit') {
        state.showCreateUpdate = true;
      }
    };

    const handleCreateFolder = () => {
      state.selectedField = {};
      state.showCreateUpdate = true;
    };

    function deleteUser() {
      Inertia.delete(route('folder.delete', state.selectedField?.id), {
        onFinish: () => {
          state.selectedField = {};
        }
      });
    }

    return {
      state,
      handleCreateFolder,
      handleAction,
      getActionButtonAttrs
    };
  }
});
</script>

<style scoped>

</style>

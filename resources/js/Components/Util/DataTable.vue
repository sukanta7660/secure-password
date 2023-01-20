<template>
  <div class="card-header">
    <div v-if="(!hideExport)" class="d-flex justify-content-between">
      <div v-if="!hideSearch">
        <Input
          v-model="state.search"
          placeholder="Search"
          class="position-relative"
          :on-clear="handleSearch"
          show-clear
        >
          <template #append>
            <i
              :class="`${getIcon('search')} input-group-text cursor-pointer`"
              @click="handleSearch"
            />
          </template>
        </Input>
      </div>
      <div>
        <slot name="header"/>
      </div>
    </div>
  </div>
  <table class="table table-striped align-middle">

    <thead>

      <tr>
        <th
          v-if="!hideIndex"
          class="text-center"
        >
          {{ indexTitle }}
        </th>

        <th
          v-for="(column, index) in state.tableColumn"
          :key="`${'column'}-${index}`"
          :class="column.headerClass"
        >
          {{ column.label }}
        </th>

      </tr>

    </thead>

    <tbody>

      <tr v-if="!state.tableRow.length">

        <td
          :colspan="(state.tableColumn.length + 1)"
          class="text-center fw-bold"
        >
          No Data Found
        </td>
      </tr>

      <tr
        v-for="(item, index) in state.tableRow"
        :key="`data-item-${index}`"
      >

        <td v-if="!hideIndex" class="text-center"> {{ getIndex(index) }}</td>

        <template
          v-for="(column, idx) in state.tableColumn"
          :key="`column-${idx}`"
          :class="column.class"
        >

          <td class="align-middle">
            <slot :name="column.key" :row="item">

              <span v-if="!column.formatter">
                {{ item[column.key] }}
              </span>

              <span
                v-else
                v-html="dataFormatter(item, column.key, column.formatter)"
              />
            </slot>
          </td>

        </template>

      </tr>

    </tbody>

  </table>
  <Pagination v-if="state.hasPaginator" :paginator="paginator"/>
</template>

<script>
import { computed, reactive, watch } from 'vue';
import Input from '@/Components/Input';
import { getIcon } from '@/util/helper';
import Pagination from '@/Components/Util/Pagination';


export default {

  name: 'DataTable',
  components: { Pagination, Input },
  props: {

    column: {
      type: Array,
      required: true
    },

    items: {
      type: Array
    },

    hideIndex: {
      type: Boolean,
      default: false,
    },

    indexTitle: {
      type: String,
      default: '#'
    },

    currentPage: {
      type: Number,
      default: 1
    },

    search: {
      type: String,
    },

    hideSearch: {
      type: Boolean,
      default: false
    },

    hideExport: {
      type: Boolean,
      default: false
    },

    onSearch: {
      type: Function
    },

    searchOnType: {
      type: Boolean,
      default: false
    },

    paginator: {
      type: [Array, Object],
    }
  },
  emits: ['update:search'],

  setup(props, { emit }) {

    const state = reactive({

      tableRow: computed(() => {
        return props.items;
      }),

      tableColumn: computed(() => {
        return props.column;
      }),

      search: props.search,

      hasPaginator: computed(() => {

        if (!props.paginator) {
          return false;
        }

        if (!props.paginator?.links?.length) {
          return false;
        }

        return true;
      })
    });

    const dataFormatter = (data, column, cb) => {

      if (typeof cb === 'function') {
        return cb(data);
      }

      return data[column];
    };

    const getIndex = (index) => {
      switch (props.currentPage) {
      case 1:
        return index + 1;
      case 2:
        return (index + 1) + (props.currentPage - 1) * 10;
      default:
        return (props.currentPage - 1) * (10 + index + 1);
      }
    };

    const handleSearch = () => {

      if (typeof props.onSearch === 'function') {
        return props.onSearch(state.search);
      }
    };

    watch(() => props.search, (newValue) => state.search = newValue, { immediate: true });

    watch(() => state.search, (newValue) => {

      emit('update:search', newValue);

      if (props.searchOnType) {
        return handleSearch();
      }

    });

    return {
      state,
      dataFormatter,
      getIndex,
      handleSearch,
      getIcon
    };
  }
};
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>

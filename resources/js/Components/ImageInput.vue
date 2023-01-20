<template>
  <Input
    type="text"
    :placeholder="inputPlaceHolder"
    readonly
    class="position-relative"
    v-bind="$attrs"
    :error="error"
    @click="triggerUpload"
  >
    <template #append>
      <i
        v-if="showClearIcon"
        class="bi bi-x-lg clear-icon"
        @click="handleClear"
      />
      <span class="input-group-text" @click="triggerUpload">
        <slot name="upload-icon">
          <i class="bi bi-upload"/>
        </slot>
      </span>
    </template>
    <template #prepend>
      <input
        ref="upload"
        type="file"
        class="d-none"
        :native="true"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileSelect"
      >
    </template>
  </Input>
  <slot name="preview" :files="state.fileListsWithMetadata">
    <div v-if="showPreview && state.previewImage" class="mt-3">
      <img
        :src="state.previewImage"
        class="rounded mx-auto d-block img-fluid img-thumbnail"
        :alt="state.previewImage"
      >
    </div>
  </slot>
</template>

<script>
import { generatePreview, getFileMetadata, getHumanReadableFileSize } from '@/util/helper';
import { defineComponent, computed, nextTick, ref, watchEffect, reactive } from 'vue';
import Input from '@/Components/Input';

export default defineComponent({

  name: 'ImageInput',

  components: { Input },

  props: {

    modelValue: {
      required: false,
      type: [String, Blob, File, Number, Array]
    },

    showPreview: {
      type: Boolean,
      default: false
    },

    existingFile: {
      type: [String, Array]
    },

    multiple: {
      type: Boolean,
      default: false
    },

    canClear: {
      type: Boolean,
      default: false
    },

    accept: {
      type: String,
      default: 'image/*'
    },

    error: {
      type: String
    },

    existing: {
      type: String,
    }
  },

  emits: ['update:modelValue', 'select'],

  setup(props, { emit }) {

    const state = reactive({
      selectedFiles: [],
      fileListsWithMetadata: [],
      inputPlaceHolder: null,
      previewImage: ''
    });

    const upload = ref(null);

    const showClearIcon = computed(() => {

      if (!props.canClear) {
        return false;
      }

      return !!state.selectedFiles.length;
    });

    const inputPlaceHolder = computed(() => {

      if(!state.selectedFiles.length) {
        return 'Please select a file';
      }

      if(props.multiple && state.selectedFiles.length > 1) {
        return `${state.selectedFiles.length} file selected`;
      }

      return state.selectedFiles[0].name;

    });


    const generateFileMetadata = () => {

      const selectedFiles = [...state.selectedFiles];

      if (!selectedFiles.length) {
        return;
      }

      const metadata = selectedFiles.map((item) => ({
        ...getFileMetadata(item, {
          previewGenerator: generatePreview,
          sizeFormatter: getHumanReadableFileSize,
          file: item
        })
      }));

      state.fileListsWithMetadata = [...metadata];

    };

    const loadPreview = () => {

      if(!props.showPreview) {
        return;
      }

      if(props.multiple) {
        return;
      }

      if(!state.selectedFiles.length && props.existingFile) {
        return;
      }

      if(!state.selectedFiles.length) {

        if(!props.existingFile) {
          return;
        }

        state.previewImage = props.existingFile;
      }

      if(state.selectedFiles.length) {
        state.previewImage = state.fileListsWithMetadata[0].preview;
      }

    };

    // Click upload
    const triggerUpload = () => nextTick(() => upload.value.click());

    const updateModelValue = () => {

      const fileToEmit = props.multiple
        ? state.selectedFiles
        : state.selectedFiles.length
          ? state.selectedFiles[0]
          : null
      ;

      return emit('update:modelValue', fileToEmit);
    };

    // Handle user select
    const handleFileSelect = (event) => {

      state.selectedFiles = [...event.target.files];
      event.target.value = ''; // hacks for re-selecting same image again

      generateFileMetadata();
      loadPreview();
      return updateModelValue();

    };

    const handleClear = () => {
      state.selectedFiles = [...[]];
      state.fileListsWithMetadata = [...[]];
      state.previewImage = '';
    };

    watchEffect(loadPreview);


    return {
      state,
      upload,
      handleClear,
      showClearIcon,
      triggerUpload,
      handleFileSelect,
      inputPlaceHolder
    };
  }
});
</script>

<style scoped>
.clear-icon {
  position: absolute;
  display: inline-block;
  right: 50px;
  top: 8px;
  cursor: pointer;
  z-index: 9999;
}

.preview {
  max-width: 100%
}
</style>

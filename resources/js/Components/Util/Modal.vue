<template>
  <!-- Modal -->
  <transition-group name="fade">
    <slot name="activator" :toggle="toggle"/>
    <div
      v-if="state.showModal"
      class="modal fade show"
      :class="wrapperClass"
      style="display : block;"
    >
      <div ref="modal" class="modal-dialog" :class="state.modalClasses">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header"><h5 v-if="!!title" class="modal-title">{{ title }}</h5></slot>
            <button
              v-if="!hideClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            />
          </div>
          <div class="modal-body">
            <transition name="fade">
              <div v-if="state.showModal">
                <slot/>
              </div>
            </transition>
          </div>
          <slot name="footer">
            <div v-if="state.showFooter" class="modal-footer">
              <Button
                v-if="showCancelButton"
                color="primary"
                outlined
                :disabled="state.dataSubmitting"
                :text="cancelButtonText"
                @click="handleCancel"
              />
              <Button
                v-if="showConfirmButton"
                color="primary"
                :disabled="state.dataSubmitting || disableConfirmButton"
                :loading="state.dataSubmitting"
                :text="confirmButtonText"
                @click="handleConfirm"
              />
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div v-if="state.showModal" class="modal-backdrop fade show"/>
  </transition-group>
</template>

<script>
import { computed, defineComponent, reactive, watch, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Button from '@/Components/Button';

export default defineComponent({
  name: 'Modal',

  components: { Button },

  props: {

    modelValue: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
    },

    hideFooter: {
      type: Boolean,
      default: false
    },

    onConfirm: {
      type: Function,
      required: false
    },

    onCancel: {
      type: Function,
      required: false
    },

    confirmButtonText: {
      type: String,
      default: 'Save Records'
    },

    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },

    showConfirmButton: {
      type: Boolean,
      default: true
    },

    showCancelButton: {
      type: Boolean,
      default: true
    },

    hideClose: {
      type: Boolean,
      default: false
    },

    confirmButtonLoading: {
      type: Boolean,
      default: false
    },

    disableConfirmButton: {
      type: Boolean,
      default: false
    },

    centered: {
      type: Boolean,
      default: false
    },

    scrollable: {
      type: Boolean,
      default: false
    },

    size: {
      type: String,
      default: 'default',

      validator: (value) => {
        const acceptedSize = ['default', 'sm', 'lg', 'xl'];

        if (acceptedSize.includes(value)) {
          return true;
        }

        throw new Error(`Invalid Size, accepted property ${ acceptedSize }`);
      }
    },

    wrapperClass: {
      type: String,
      required: false,
    },

    contentWrapperClass: {
      type: String,
      required: false
    },

    persistent: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {

    const state = reactive({

      showModal: false,

      modalClasses: computed(() => {

        let classes = '';

        if (props.contentWrapperClass) {
          classes += `${ props.contentWrapperClass }`;
        }

        if (props.size !== 'default') {
          classes += `modal-${ props.size }`;
        }

        if (props.centered) {
          classes += 'modal-dialog-centered';
        }

        if (props.scrollable) {
          classes += 'modal-dialog-scrollable';
        }

        return classes;
      }),

      confirming: false,

      dataSubmitting: computed(() => {

        return state.confirming
          ? true
          : props.confirmButtonLoading
        ;
      }),

      showFooter: computed(() => {

        if (props.hideFooter) {
          return false;
        }

        if (props.showCancelButton || props.showConfirmButton) {
          return true;
        }

        return false;
      })
    });

    const fireEvent = (event, value) => emit(event, value);

    const modal = ref(null);

    onClickOutside(modal, () => {

      if (props.persistent) return;

      closeModal();
    });

    const closeModal = () => {

      fireEvent('close', false);

      state.showModal = false;
    };

    const handleConfirm = async () => {

      if (typeof props.onConfirm !== 'function') {
        closeModal();
        return;
      }

      state.confirming = true;

      try {
        await props.onConfirm();
      } finally {
        state.confirming = false;
      }
    };

    const handleCancel = async () => {

      if (typeof props.onCancel === 'function') {
        await props.onCancel();
      }

      closeModal();
    };

    const toggle = () => state.showModal = !state.showModal;

    watch(() => state.showModal, (nv) => {
      fireEvent('update:modelValue', nv);
    });

    watch(() => props.modelValue, (nv) => {
      state.showModal = nv;
    });

    return {
      state,
      closeModal,
      handleConfirm,
      handleCancel,
      modal,
      toggle
    };
  }
});
</script>

<style lang="scss" scoped>
.modal-dialog-scrollable .modal-body {
    overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active,
.fade-enter-from,
.fade-leave-to {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-header {
    padding: .6rem 1rem;
}

</style>

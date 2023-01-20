import { confirmDelete, emitter, resolveDependency } from '@/util/helper';
import { computed, getCurrentInstance, reactive } from 'vue';

import { useToast } from 'vue-toastification';
import { usePage } from '@inertiajs/inertia-vue3';

export function useEmitter() {

  const bus = emitter();

  return {
    bus
  };
}

export function useHelper() {

  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error('Composable must be called in setup methods');
  }

  const appState = reactive({
    sidebarOpen: false
  });

  const toggleSidebarState = () => {
    appState.sidebarOpen = !appState.sidebarOpen;
  };

  const { bus } = useEmitter();

  const setPageTitle = (title) => bus.emit('setTitle', title);

  const route = (...args) => window.route(...args);

  const ziggyAttrs = instance.attrs.ziggy;

  const isCurrentRoute = (params) => route().current(params);

  const forceUpdate = () => instance.proxy.$forceUpdate();

  return {
    appState,
    setPageTitle,
    isCurrentRoute,
    route,
    toggleSidebarState,
    confirmUser: confirmDelete,
    forceUpdate,
    instance
  };
}

export function useProps() {

  const page = usePage();

  return {
    ...page.props.value
  };
}

/**
 * show toast notification
 * @param { Object } config {
 *     @param {String} config.position - {`top-right`, `top-center`, `top-left`, `bottom-right`, `bottom-center`, `bottom-left`}
 *     @param {Number} config.timeout - time in millisecond
 *     @param {Boolean} config.closeOnClick - true or false
 *     @param {Boolean} config.pauseOnFocusLoss - true or false
 *     @param {Boolean} config.pauseOnHover - true or false
 *     @param {Boolean} config.draggable - true or false
 *     @param {int} config.draggablePercent - Float
 *     @param {Boolean} config.showCloseButtonOnHover - true or false
 *     @param {Boolean} config.hideProgressBar - true or false
 *     @param {String | Boolean} config.closeButton - button or false
 *     @param {Boolean} config.icon - true or false
 *     @param {Boolean} config.rtl - true or false
 * }
 * @returns {Object} {
 *     @return {Function} notify: (function(message, config): void),
 *     @return {Function} notifyWarning: (function(message, config): void),
 *     @return {Function} notifyInfo: (function(message, config): void),
 *     @return {Function} notifyError: (function(message, config): void),
 *     @return {Function} notifySuccess: (function(message, config): void)
 * }
 */

export function useNotify(config = {}) {

  const defaultConfig = {
    position: 'top-right',
    timeout: 3048,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transition: 'Vue-Toastification__slideBlurred',
    maxToasts: 10,
    ...config
  };

  const toast = useToast();

  const fireNotification = (message, type, config) => {

    const constructorConfig = {
      ...defaultConfig,
      ...config
    };

    return toast[type](message, constructorConfig);
  };

  const notify = (message, config) => {

    const constructorConfig = {
      ...defaultConfig,
      ...config
    };

    return toast(message, constructorConfig);
  };

  const notifySuccess = (message, config) => {
    return fireNotification(message, 'success', config);
  };

  const notifyWarning = (message, config) => {
    return fireNotification(message, 'warning', config);
  };

  const notifyInfo = (message, config) => {
    return fireNotification(message, 'info', config);
  };

  const notifyError = (message, config) => {
    return fireNotification(message, 'error', config);
  };

  return {
    notify,
    notifySuccess,
    notifyWarning,
    notifyInfo,
    notifyError
  };
}

/**
 *
 * @returns {{
 *      modelState: *,
 *      updateModelState: function
 * }}
 */
export function useModelValue() {

  const { instance } = useHelper();

  const { emit, props } = instance;

  let dataValue = computed({
    get: () => props.modelValue,
    set: (value) => update(value)
  });

  if (props.value) {
    dataValue.value = props.value;
  }

  const update = (value) => emit('update:modelValue', value, instance);

  return {
    modelState: dataValue,
    updateModelState: update
  };
}

/**
 * @param {Array} features
 * @param {Object} deps
 * @returns {Object}
 */
export function resolveDeps(features, deps = {}) {

  const { instance } = useHelper();

  return resolveDependency(instance.props, instance, features, deps);
}

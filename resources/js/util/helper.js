import Emitter from 'tiny-emitter/instance';
import Swal from 'sweetalert2';
import { ACTION_TYPE, ACTION_TYPE_COLOR, ACTION_TYPE_ICON, ACTION_TYPE_LABEL, ICONS } from '@/util/consts';
import dayjs from 'dayjs';
import { isBoolean } from 'lodash';

export const emitter = () => Emitter;

/**
 * Generate random unique string base on timestamp
 * - super function
 * @return {string}
 */
export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


/**
 * show user a confirmation and then take action based on confirmation
 * @param {{onConfirm: ((function(): Promise<void>)|*)}} config {
 *      @param {String} config.title
 *      @param {String} config.text
 *      @param {String} config.icon
 *      @param {String} config.confirmButtonColor
 *      @param {String} config.cancelButtonColor
 *      @param {String} config.confirmButtonText
 *      @param {Boolean} config.showLoaderOnConfirm
 *      @param {Boolean} config.showCancelButton
 *      @param {Function} config.onConfirm
 *      @param {Function} config.onCancel
 * }
 * @return {Promise<void>}
 */
export const confirmDelete = (config = {}) => {

  const defaultConfig = {
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    showLoaderOnConfirm: true,
    onConfirm: _ => _,
    onCancel: _ => _,
    ...config
  };
  return Swal.fire({
    title: defaultConfig.title,
    text: defaultConfig.text,
    icon: defaultConfig.icon,
    showCancelButton: defaultConfig.showCancelButton,
    confirmButtonColor: defaultConfig.confirmButtonColor,
    cancelButtonColor: defaultConfig.cancelButtonColor,
    confirmButtonText: defaultConfig.confirmButtonText,
    showLoaderOnConfirm: defaultConfig.showLoaderOnConfirm,
    closeOnClickOutside: false,
    allowOutsideClick: () => !Swal.isLoading(),
    backdrop: true,

    preConfirm: async () => {
      if (typeof defaultConfig.onConfirm === 'function') {
        return defaultConfig.onConfirm();
      }
    }
  })
    .then((result) => {
      if (!result.isConfirmed) {
        defaultConfig.onCancel();
      }
    }
    )
  ;
};

/**
 *
 * @param {String} action
 * @param {Boolean} showLabel
 * @returns {{color: String, icon: String, text?: String}}
 */
export const getActionButtonAttrs = (action, showLabel = false) => {

  if (!action in ACTION_TYPE) {
    throw new Error('Invalid action type');
  }

  const attrs = {
    color: ACTION_TYPE_COLOR[action],
    icon: ACTION_TYPE_ICON[action],
    type: 'button',
    title: ACTION_TYPE_LABEL[action]
  };

  if (showLabel) {
    attrs.text = ACTION_TYPE_LABEL[action];
  }

  return attrs;
};

/**
 *
 * @param { String } iconType
 * @returns { String } icon
 */
export const getIcon = (iconType) => {

  if (!iconType in ICONS) {
    return '';
  }

  return ICONS[iconType];
};

export const getActionColor = (action) => {

  if (!action in ACTION_TYPE_COLOR) {
    return '';
  }

  return ACTION_TYPE_COLOR[action];
};

export const getBadgeAttrs = (attrs, rounded = false) => {

  const attr = isBoolean(attrs)
    ? attrs ? 'success' : 'danger'
    : attrs;
  const type = getActionColor(attr);
  const icon = getIcon(attr);

  const badgeAttrs = {
    type: 'light',
    pill: rounded,
    value: `<i class="${ icon } text-${ type }" style="font-size: 25px"/>`
  };

  return badgeAttrs;
};

/**
 * @param { Object } props
 * @param { Object } context
 * @param {Array} features
 * @param {Object} deps
 * @returns {Object}
 */
export const resolveDependency = (props, context, features, deps = {}) => {

  let featureList = [];

  if (!Array.isArray(features)) {
    features = [features];
  }

  featureList = [...features];

  featureList.forEach((compositor) => {
    deps = {
      ...deps,
      ...compositor(props, context, deps),
    };
  });

  return {
    ...deps
  };
};

/**
 *
 * @param {String} timeString
 * @param {String} format
 * @see https://day.js.org/docs/en/display/format
 * @returns {string}
 */
export const formatTime = (timeString, format = 'hh:mm:A') => {

  if (!dayjs(timeString).isValid()) {
    throw new Error('Invalid Timestamp');
  }

  return dayjs(timeString).format(format);
};
/**
 *
 * @param {String} timeString
 * @param {String} format
 * @see https://day.js.org/docs/en/display/format
 * @returns {string}
 */
export const formatDate = (timeString, format = 'DD-MMM-YYYY') => {
  return formatTime(timeString, format);
};

/**
 *
 * @param { String } timestamp - timestamp
 * @param { Object } config - date time formatter and separator
 * @param { String } config.timeFormat - time formatter
 * @param { String } config.dateFormatter - date formatter
 * @param { String } config.separator - date time separator
 * @see https://day.js.org/docs/en/display/format
 * @return string
 */
export const formatDateTime = (timestamp, config = {}) => {

  const defaultConfig = {
    timeFormat: undefined,
    dateFormat: undefined,
    separator: 'at',
    ...config
  };

  const date = formatDate(timestamp, defaultConfig.dateFormat);
  const time = formatTime(timestamp, defaultConfig.timeFormat);

  return `${ date } ${ defaultConfig.separator } ${ time }`;
};

/**
 *
 * @param  {Blob|File} input
 * @returns {boolean}
 */
export const isFile = (input) => {

  let file = false;

  if ('File' in window && input instanceof File) {
    file = true;
  }

  if ('Blob' in window && input instanceof Blob) {
    file = true;
  }

  return file;
};

/**
 *
 * @param file
 * @returns {string}
 */
export const generatePreview = (file) => {

  if (!isFile(file)) {
    return 'Invalid File';
  }

  return URL.createObjectURL(file);
};

/**
 * @param data
 * @param fName
 */

export const exportCsv = (data, fName = null) => {

const fileName = !fName ? 'data.csv' : `${fName}.csv`;

  const rows = [Object.keys(data[0]).join(",")].concat(
    data.map(row =>
      Object.values(row)
        .map(val => `"${val}"`)
        .join(",")
    ));

  let csvContent = rows.join("\n");

  let blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  if (navigator.msSaveBlob) {

    navigator.msSaveBlob(blob, fileName);

  } else {

    let link = document.createElement("a");

    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }
};

/**
 *
 * @param file
 * @param {{sizeFormatter: ((function(*, *): string)|*)}} config
 * @param {Function} config.sizeFormatter - default size in byte
 * @param {Function} config.typeFormatter - default format return type
 * @param {Function} config.previewGenerator - default format return type
 * @returns {{size: string, name: string, type: string}}
 */
export const getFileMetadata = (file, config = {}) => {

  const defaultConfig = {
    sizeFormatter: e => e,
    typeFormatter: e => e,
    previewGenerator: e => e,
    ...config
  };

  if (!isFile(file)) {
    return {
      name: 'Invalid File',
      size: 'Invalid File',
      type: 'Invalid File',
      preview: 'Invalid File',
    };
  }

  return {
    name: file.name,
    size: defaultConfig.sizeFormatter(file.size),
    type: defaultConfig.typeFormatter(file.type),
    preview: defaultConfig.previewGenerator(file)
  };
};

/**
 *
 * @param bytes
 * @param decimals - optional
 * @returns {string}
 */
export const getHumanReadableFileSize = (bytes, decimals = 2) => {

  if (bytes < 1) {
    return '0 Bytes';
  }

  let k = 1024;
  let dm = decimals;

  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

import * as themeConfig from '../provider/configProvider';
import { getCurrentInstance, resolveComponent } from 'vue';

export const dependencyResolver = (props, context, features, deps = {}) => {

  const instance = getCurrentInstance();

  features.forEach((item) => {
    deps = {
      ...deps,
      ...item(props, context, deps).bind(instance)
    };
  });

  return deps;
};

export const getUniqueId = (prefix = 'has') => {
  const randomString = Date.now().toString(36) + Math.random().toString(36);
  return `${ prefix }-${ randomString }`;
};

export const getAttribute = (attrs, provider = null) => {

  let classLists = provider
    ? getAttrFromProvider(provider)
    : getAttrFromElement(attrs)
    ;

  const { containerClass, labelClass, inputClass } = classLists;

  const elementId = attrs.id ?? getUniqueId();

  let labelAttrs = {
    for: elementId,
    class: labelClass
  };

  let inputAttrs = {
    class: inputClass,
    id: elementId,
    ...attrs
  };

  let containerAttrs = {
    class: containerClass
  };

  return {
    labelAttrs,
    inputAttrs,
    containerAttrs
  };

};

export const getAttrFromProvider = (provider) => {

  if(!provider in themeConfig) {
    throw new Error(`Invalid Provider ${provider}`);
  }

  const { containerClass, labelClass, inputClass } = themeConfig[provider];

  return {
    containerClass, labelClass, inputClass
  };
};

export const getAttrFromElement = (element) => {

  let containerClass = '';
  let inputClass = '';
  let labelClass = '';

  if (element.containerClass) {
    containerClass = element.containerClass;
  }

  if (element.labelClass) {
    labelClass = element.inputClass;
  }

  if (element.inputClass) {
    inputClass = element.inputClass;
  }

  return {
    containerClass,
    inputClass,
    labelClass,
  };

};

export const componentResolver = ()=> {

  resolveComponent('');
};

class Errors {
  /**
     * Create a new Errors instance.
     */
  constructor(fields) {
    this.errors = {};
  }

  all() {

    if (!Object.keys(this.errors)) {
      return [];
    }

    let errors = [];

    Object.entries(this.errors).forEach(([key, value]) => {

      if (Array.isArray(value)) {
        errors.push(value[0]);
      } else {
        errors.push(value);
      }

    });

    return errors;
  }

  /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  /**
     * Determine if we have any errors.
     */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     * @param asArray
     */
  get(field, asArray = false) {

    if (!this.errors?.[field]) {
      return asArray ? [] : '';
    }

    return asArray
      ? this.errors[field]
      : this.errors[field][0]
    ;
  }

  /**
     * Record the new errors.
     *
     * @param {object} errors
     */
  record(errors) {
    this.errors = errors;
  }

  /**
     * Clear one or all error fields.
     *
     */
  clear(field) {

    if (field) {
      delete this.errors?.[field];
      return;
    }

    this.errors = {};
  }

  toString() {
    return JSON.stringify(this.errors);
  }
}

class Form {
  /*
    * Check if the form is submitting or not.
    */
  isSubmitting = false;

  /*
    * Keep Track of the fields.
    */
  originalData = {};

  /*
    * Original data of the form.
    */
  fields = {};

  /*
    * Check the validity of the form.
    */
  formIsValid = false;

  /*
    * Check what the action should be when the field is blurred.
    */
  validateOnBlur = false;

  /*
    * Set which action to be fired when field is blurred
    */
  actionOnBlur = 'reset';

  /*
    * Set if the form has validation rules or not
    */
  hasValidationRules = false;

  /*
    * Keep Track of user filled data.
    */
  filledData = {};

  /*
    * Check if the form value is changed or not.
    */
  isDirty = false;

  /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
  constructor(data) {

    if (typeof data !== 'object') {
      throw new Error('Form data must be an object (<key> => <value> pairs)');
    }

    this.originalData = data;

    for (let field in data) {
      this[field] = this.clone(data[field]);
      this.fields[field] = this.clone(data[field]);
      this.filledData[field] = this.clone(data[field]);
    }

    this.formIsValid = true;

    this.errors = new Errors();
    return this;
  }

  /**
     * Fetch all relevant data for the form.
     */
  data(asFormData = false) {
    let data = {};

    for (let property in this.originalData) {
      data[property] = this[property];
    }

    if (!asFormData) {
      return data;
    }

    let formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          formData.append(`${ key }[${ idx }]`, typeof item === 'object' ? JSON.stringify(item) : item);
        });
      } else {
        formData.append(key, value);
      }
    }
    return formData;
  }

  /**
     * Reset the form fields.
     */
  reset() {
    for (let field in this.originalData) {
      this[field] = this.clone(this.originalData[field]);
    }

    this.errors.clear();
  }

  /**
     * Submit the form.
     *
     * @param cb
     * @param onSuccess
     * @param onError
     */
  async submit(cb, onSuccess = (d) => d, onError = (e) => e) {

    if (typeof cb !== 'function') {
      throw new Error('Callback must be a function');
    }
    this.isSubmitting = true;
    try {
      const response = await cb(this.data());
      this.onSuccess(response);
      this.isSubmitting = false;
      return onSuccess(response);

    } catch (e) {
      this.errors.record(e?.errors);
      this.isSubmitting = false;
      return onError(e);
    }
  }

  /**
     * Handle a successful form submission.
     *
     * @param {object} data
     */
  onSuccess(data) {
    // Reset validation errors.
    //this.reset();

    // return response;
    return data;
  }

  /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     */
  onFail(errors) {
    // Record the errors.
    this.errors.record(errors);

    // return errors;
    return errors;
  }

  on(event, cb = (d) => d) {
    //console.log(event.target.value);
  }

  onBlur(field) {
    if (this.actionOnBlur === 'reset') {
      this.errors.clear(field);
    }
  }

  fillData(data) {
    for (let field in data) {
      for (let property in this.originalData) {
        if (field === property) {
          this.setFieldValue(property, data[field]);
          this.filledData[property] = data[field];
        }
      }
    }
  }

  setFieldValue(field, value) {
    this[field] = value;
    this.fields[field] = value;
    this.originalData[field] = value;
  }

  getFieldValue(field) {
    return this[field];
  }

  async validate(field, rules) {

    if (!Array.isArray(rules)) {
      throw new Error('Validation rules must be an array');
    }

    for (let rule of rules) {

      if (typeof rule !== 'function') {
        throw new Error('Validation rules must be functions');
      }

      let result = rule(this[field]);

      if (!result) {
        // the field has error
        // record error
        this.errors.record({[field]: result});
        // stop the loop
        break;
      }
    }

    if (this.errors.has(field)) {
      this.formIsValid = false;
      return false;
    }

    return true;
  }

  /**
     * Clone an object or array.
     * @param {object|array} source
     * @returns {object|array}
     * @memberof Form
     */
  clone(source) {

    if (Object.prototype.toString.call(source) === '[object Array]') {

      let clone = [];

      for (let i = 0; i < source.length; i++) {
        clone[i] = this.clone(source[i]);
      }

      return clone;
    }

    if (typeof (source) == 'object') {

      let clone = {};

      for (let prop in source) {

        if (source.hasOwnProperty(prop)) {
          clone[prop] = this.clone(source[prop]);
        }

      }

      return clone;
    }

    return source;
  }
}

export default Form;

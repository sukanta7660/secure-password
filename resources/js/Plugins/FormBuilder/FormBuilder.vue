<template>
  <form>
    <TextInput
      id="hasan"
      v-model="state.form.name"
      label="Hello"
      placeholder="text"
      type="password"
    />
    <!--        <template v-for="(field, index) in fields">-->
    <!--            {{ field }}-->
    <!--        </template>-->
  </form>
</template>

<script>

import { reactive } from 'vue';
import TextInput from '@/Plugins/FormBuilder/Components/TextInput';

const schema = {

  name: {
    type: 'text',
    label: 'Name',
    id: 'Name',
    placeholder: '',
    value: ''
  },

  sex: {
    type: 'radio',
    label: 'sex',
    options: [

      {
        label: 'Male',
        value: 'male'
      },

      {
        label: 'Female',
        value: 'female'
      },

      {
        label: 'Other',
        value: 'other'
      }
    ],
    default: 'male',
  },

  email: {
    type: 'email',
    label: 'Email',
    id: 'email',
    placeholder: 'Email',
    value: ''
  },

  city: {
    type: 'select',
    label: 'City',
    id: 'City',
    placeholder: 'City',
    options: [
      {
        label: 'Sylhet',
        value: 'sylhet'
      },
      {
        label: 'Dhaka',
        value: 'Dhaka'
      }
    ],
  },

  phone: {
    type: 'tel',
    label: 'Phone',
    id: 'phone',
    placeholder: 'phone',
  },

  profile_photo: {
    type: 'image',
    label: 'Profile Photo',
    id: 'profile_photo',
    placeholder: 'Profile Photo',
    showPreview: true
  },

  intro_video: {
    type: 'video',
    label: 'Intro video',
    id: 'intro_video',
    placeholder: 'Intro video',
    showPreview: true
  },

  submit: {
    type: 'submit',
    handler: () => ({}),
  }
};

export default {

  name: 'FormBuilder',
  components: { TextInput },
  setup() {

    const buildForm = (schema) => {

      if (typeof schema !== 'object') {
        throw new Error('Schema must be an key value paired object');
      }

      let modelValue = {};
      let fields = [];

      for (let key in schema) {

        if (key !== 'submit') {
          modelValue[key] = schema[key].value ?? '';
        }

        fields.push({ ...schema[key] });
      }

      return {
        modelValue,
        fields
      };
    };

    const { fields, modelValue } = buildForm(schema);

    const state = reactive({
      form: {
        ...modelValue
      }
    });

    return {
      state, fields
    };
  }
};
</script>

<style scoped>

</style>

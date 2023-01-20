<template>
  <div>
    <div class="row">
      <div class="col-lg-3 col-md-4 label ">Full Name</div>
      <div class="col-lg-9 col-md-8">
        <Input
          v-model="state.name"
          :error="errors?.name"
          type="text"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-3 col-md-4 label">Email</div>
      <div class="col-lg-9 col-md-8">
        <Input v-model="state.email" :error="errors?.email" type="email"/>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-end">
          <Button
            color="primary"
            text="Save Changes"
            type="button"
            @click="handleUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import Form from '@/Plugins/FormBuilder/Service/Form';
import Input from '@/Components/Input.vue';
import Button from '@/Components/Button';
import { reactive, watch, } from 'vue';

const props = defineProps({

  profile: {
    type: Object
  },

  errors: {
    type: Object
  },

  onUpdate: {
    type: Function
  }
});

const emit = defineEmits(['update']);

const state = reactive(new Form({
  name: '',
  email: ''
}));

const handleUpdate = () => {

  if (typeof props.onUpdate !== 'function') {
    return emit('update', state.submit((data) => data));
  }

  return state.submit(async (data) => {
    await props.onUpdate(data)
  });

}

watch(() => props.profile, (nv) => {
  return state.fillData({
    ...nv,
    ...nv.details
  });
}, { immediate: true, deep: true });

</script>

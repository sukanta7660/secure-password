<template>
  <Head title="Register"/>

  <form class="row g-3 needs-validation" @submit.prevent="submit">
    <div class="col-12">
      <Input
        v-model="form.name"
        type="text"
        label="Name"
        :error="form.errors.name"
        required
      />
    </div>

    <div class="col-12">
      <Input
        v-model="form.email"
        type="email"
        label="Email"
        :error="form.errors.email"
        required
      />
    </div>

    <div class="col-12">
      <Input
        v-model="form.password"
        type="password"
        label="Master Password"
        :error="form.errors.password"
        required
      />
    </div>

    <div class="col-12">
      <Input
        v-model="form.password_confirmation"
        type="password"
        label="Retype Master Password"
        :error="form.errors.password" required
      />
    </div>

    <div class="d-flex align-items-center flex-column flex-column-reverse g-3">
      <Link :href="route('login')"> Already registered?</Link>
      <div class="col-12 mb-2">
        <Button
          class="w-100"
          type="submit"
          :loading="form.processing"
          color="primary"
          text="Register"
        />
      </div>
    </div>
  </form>
</template>
<script>

import Auth from '@/Layouts/Auth';
import { defineComponent } from 'vue';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { useHelper } from '@/Composables/composable';
import { Head, Link, useForm } from '@inertiajs/inertia-vue3';

export default defineComponent({

  name: 'Register',

  components: {
    Head,
    Link,
    Input,
    Button
  },
  layout: Auth,

  setup() {

    const { route } = useHelper();

    const form = useForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      terms: false,
    });

    const onFinish = ()=> {
      form.reset('password', 'password_confirmation');
    };

    const submit = () => {
      form.post(route('register'), { onFinish });
    };

    return {
      submit,
      form,
      route
    };
  }
});
</script>

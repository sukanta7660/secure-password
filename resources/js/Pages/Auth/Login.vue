<template>

  <Head title="Log in"/>

  <Alert v-if="status" :message="status"/>

  <form class="row g-3 needs-validation" @submit.prevent="submit">
    <div class="col-12">
      <Input
        v-model="form.email"
        label="Email"
        type="email"
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
      <Checkbox v-model="form.remember" label="Remember me"/>
    </div>
    <div class="col-12">
      <Button class="w-100" type="submit" color="primary" :loading="form.processing"> Login</Button>
    </div>
    <div class="col-12">
      <p class="small mb-0">To register
        <Link
          v-if="canResetPassword"
          :href="route('register')"
        >
          Click Here?
        </Link>
      </p>
    </div>
  </form>
</template>
<script>

import Auth from '@/Layouts/Auth';
import { defineComponent } from 'vue';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Alert from '@/Components/Util/Alert';
import Checkbox from '@/Components/Checkbox';
import { useHelper } from '@/Composables/composable';
import { Head, Link, useForm } from '@inertiajs/inertia-vue3';

export default defineComponent({
  components: { Alert, Checkbox, Button, Input, Head, Link },
  layout: Auth,

  props: {
    canResetPassword: Boolean,
    status: String,
  },

  setup() {

    const { route } = useHelper();

    const form = useForm({
      email: '',
      password: '',
      remember: false
    });

    const submit = () => {
      form.post(route('login'), {
        onFinish: () => form.reset('password'),
      });
    };

    return {
      form, submit,
      route
    };
  }
});
</script>

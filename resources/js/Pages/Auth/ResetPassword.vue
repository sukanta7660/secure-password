<template>
  <Head title="Reset Password"/>

  <form class="row g-3 needs-validation" @submit.prevent="submit">
    <div class="col-12">
      <Input
        v-model="form.email"
        type="email"
        label="Email"
        :error="form.errors.email"
      />
    </div>

    <div class="col-12">
      <Input
        v-model="form.password"
        label="Password"
        type="password"
        :error="form.errors.password"
      />
    </div>

    <div class="col-12">
      <Input
        v-model="form.password_confirmation"
        label="Confirm Password"
        type="password"
        :error="form.errors.password_confirmation"
      />
    </div>

    <div class="col-12">
      <Button
        class="w-100"
        :loading="form.processing"
        type="submit"
      >
        Reset Password
      </Button>
    </div>
  </form>
</template>

<script>
import { Head, useForm } from '@inertiajs/inertia-vue3';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { defineComponent } from 'vue';
import Auth from '@/Layouts/Auth';

export default defineComponent({
  components: { Head, Input, Button },
  layout: Auth,
  props: {
    email: String,
    token: String,
  },

  setup(props) {
    const form = useForm({
      token: props.token,
      email: props.email,
      password: '',
      password_confirmation: '',
    });

    const submit = () => {
      form.post(route('password.update'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
      });
    };

    return {
      form,
      submit
    };
  }
});
</script>

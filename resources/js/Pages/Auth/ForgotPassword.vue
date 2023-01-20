<template>
  <Head title="Forgot Password"/>

  <div class="text-sm">
    Forgot your password? No problem. Just let us know your email address and we will email you a password reset
    link that will allow you to choose a new one.
  </div>

  <div v-if="status" class="mb-4">
    <Alert type="info" :message="status"/>
  </div>

  <form class="row g-3 needs-validation" @submit.prevent="submit">
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
      <Button
        class="w-100"
        :loading="form.processing"
        color="primary"
      >
        Email Password Reset Link
      </Button>
    </div>
  </form>
</template>

<script>
import { Head, useForm } from '@inertiajs/inertia-vue3';
import { defineComponent } from 'vue';
import Alert from '@/Components/Util/Alert';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Auth from '@/Layouts/Auth';
import { useHelper } from '@/Composables/composable';


export default defineComponent({

  components: { Alert, Input, Button, Head },

  layout: Auth,

  props: {
    status: String,
  },

  setup() {
    const { route } = useHelper();
    const form = useForm({
      email: '',
    });

    const submit = () => {
      form.post(route('password.email'));
    };

    return {
      form,
      submit
    };
  }
});

</script>

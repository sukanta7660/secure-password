<template>
  <Head title="Email Verification"/>

  <div class="text-sm text-secondary">
    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we
    just emailed to you? If you didn't receive the email, we will gladly send you another.
  </div>

  <div v-if="verificationLinkSent">
    A new verification link has been sent to the email address you provided during registration.
  </div>

  <form class="row g-3 needs-validation" @submit.prevent="submit">
    <div class="col-12">
      <Button color="primary" :loading="form.processing">Resend Verification Email</Button>

      <Link
        :href="route('logout')"
        method="delete"
        as="button"
        class="btn btn-primary"
      >
        Log Out
      </Link>
    </div>
  </form>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { Head, Link, useForm } from '@inertiajs/inertia-vue3';
import Button from '@/Components/Button';
import { useHelper } from '@/Composables/composable';
import Auth from '@/Layouts/Auth';

export default defineComponent({

  components: {
    Head,
    Link,
    Button
  },

  layout: Auth,

  props: {
    status: String,
  },

  setup(props) {

    const form = useForm();
    const { route } = useHelper();

    const submit = () => {
      form.post(route('verification.send'));
    };

    const verificationLinkSent = computed(() => props.status === 'verification-link-sent');

    return {
      form,
      submit,
      verificationLinkSent
    };
  }
});
</script>

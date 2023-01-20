<template>
  <form @submit.prevent="onSubmit">
    <div class="row mb-3">
      <Input
        v-model="passwordForm.old_password"
        type="password"
        label="Current Password"
        placeholder="Current password"
        :error="passwordForm.errors.old_password"
        required
      />
    </div>

    <div class="row mb-3">
      <Input
        v-model="passwordForm.password"
        type="password"
        placeholder="New password"
        label="New Password"
        :error="passwordForm.errors.password"
        required
      />
    </div>

    <div class="row mb-3">
      <Input
        v-model="passwordForm.password_confirmation"
        type="password"
        label="Confirm Password"
        placeholder="Confirm new password"
        :error="passwordForm.errors.password"
        required
      />
    </div>

    <div class="text-center">
      <Button
        type="submit"
        text="Change Password"
        color="primary"
        :loading="passwordForm.processing"
      />
    </div>
  </form>
</template>

<script>
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { defineComponent } from 'vue';
import { useForm } from '@inertiajs/inertia-vue3';
import { useHelper } from '@/Composables/composable';

export default defineComponent({
  name: 'ChangePassword',
  components: { Input, Button },

  setup() {

    const { route } = useHelper();

    const passwordForm = useForm({
      old_password: '',
      password: '',
      password_confirmation: ''
    });

    const onSubmit = async () => {

      await passwordForm.submit('patch', route('change-password'), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: ()=> {
          return passwordForm.reset();
        }
      });
    };

    return {
      passwordForm,
      onSubmit
    };
  }
});
</script>

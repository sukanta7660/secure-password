<template>
  <section class="section profile">
    <div class="row">

      <div class="col-xl-12">

        <div class="card">
          <div class="card-body pt-3">

            <NavTabs>

              <NavTabItem name="overview" label="Overview">
                <div class="profile-overview">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">Profile Details</h5>
                    <div class="d-flex gap-3">
                      <Button
                        type="button"
                        :color="state.isUpdating ? 'warning' : 'primary'"
                        :text="state.isUpdating ? 'Cancel' : 'Update'"
                        @click="toggleUpdateMode"
                      />
                    </div>
                  </div>

                  <ViewProfile
                    v-if="!state.isUpdating"
                    :profile="profile"
                  />

                  <UpdateProfile
                    v-else
                    :profile="profile"
                    :errors="errors"
                    :on-update="updateUserProfile"
                  />

                </div>
              </NavTabItem>

              <NavTabItem name="password" label="Change password">
                <div class="pt-3 mt-2">
                  <ChangePassword/>
                </div>
              </NavTabItem>
            </NavTabs>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { useHelper } from '@/Composables/composable';
import NavTabs from '@/Components/Util/NavTabs';
import NavTabItem from '@/Components/Util/NavTabItem';
import Button from '@/Components/Button';
import ChangePassword from '@/Components/Profile/ChangePassword';
import ViewProfile from "@/Components/Profile/ViewProfile.vue";
import UpdateProfile from "@/Components/Profile/UpdateProfile.vue";
import { Inertia } from "@inertiajs/inertia";

export default defineComponent({
  name: 'Profile',
  components: { UpdateProfile, ViewProfile, ChangePassword, NavTabItem, NavTabs, Button },
  props: {

    profile: {
      type: [Array, Object],
    },

    errors: {
      type: [Array, Object],
    },
  },

  setup() {

    const { setPageTitle } = useHelper();
    setPageTitle('Profile');

    const state = reactive({
      isUpdating: false,
    });

    const toggleUpdateMode = () => {
      state.isUpdating = !state.isUpdating
    }

    const updateUserProfile = async (data) => {
      return Inertia.put(route('update-profile'), data, {
        onSuccess: toggleUpdateMode
      });
    }

    return {
      state,
      toggleUpdateMode,
      updateUserProfile
    };
  }
});
</script>

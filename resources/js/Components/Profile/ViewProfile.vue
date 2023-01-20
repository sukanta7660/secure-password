<template>
    <div class="row">
      <div class="col-lg-3 col-md-4 label ">Full Name</div>
      <div class="col-lg-9 col-md-8">{{ profile.name }}</div>
    </div>

    <div class="row">
      <div class="col-lg-3 col-md-4 label">Email</div>
      <div class="col-lg-9 col-md-8">{{ profile.email }}</div>
    </div>

</template>

<script setup>
const props = defineProps({
  profile: {
    type: [ Object, Array ]
  }
})
</script>

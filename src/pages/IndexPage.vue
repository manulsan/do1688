<template>
  <q-page class="row items-center justify-evenly">
    <!--     
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component> -->
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
  try {
    //----------------------------------------------------------------------------
    // move to ranking page
    await router.push('/ranking');
  } catch (error) {
    console.log(error);
  }
});
</script>

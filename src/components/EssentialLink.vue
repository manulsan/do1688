<template>
  <!-- <q-item clickable tag="a" target="_blank" :href="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item> -->

  <q-item :clickable="true" v-ripple :to="to" style="height: 48px; min-height: 48px">
    <q-item-section side>
      <q-icon :name="icon" color="green-4" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ $t(props.title) }}</q-item-label>
      <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  to?: string;
  icon?: string;
  seperator: boolean;
}

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  title: '',
  caption: '',
  link: '#',
  icon: '',
  to: '',
});
</script>

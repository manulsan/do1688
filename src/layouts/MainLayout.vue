<template>
  <q-layout view="HHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title @click="$router.push('/')" style="cursor: pointer">
          {{ $t('Rank One') }}
          <q-badge class="q-ml-none" color="teal" align="top">v1.9</q-badge>
        </q-toolbar-title>

        <!-- <span class="text-bold text-body1 text-grey-4">
          {{ useUserSetting.name }}
          <q-badge v-if="!isMobile" class="q-ml-none" color="teal" align="top">{{
            useUserSetting.email
          }}</q-badge>
        </span> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="200">
      <q-list>
        <!-- <q-item-label header>{{ $t('Menus') }} </q-item-label> -->

        <template v-for="(menu, index) in menuItems" :key="index">
          <q-separator v-if="menu.seperator" />
          <EssentialLink v-else v-bind="menu" />
        </template>

        <div class="q-pa-md absolute-bottom">
          <LanguageSwitcher />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

import { useUserSettingStore } from 'src/stores/user-setting';
import { useScreenUtil } from 'src/composables/useScreenUtil';

const { isMobile } = useScreenUtil();
console.log('isMobile=', isMobile.value);
const leftDrawerOpen = ref(false);
// const userName = ref('none');
const userSettingStore = useUserSettingStore();
const { locale } = useI18n({ useScope: 'global' });

const menuItems: EssentialLinkProps[] = [
  {
    title: 'product rank',
    caption: 'product ranking check',
    icon: 'favorite',
    to: '/ranking',
  },
  // {
  //   title: 'image translation',
  //   caption: 'setup User Settings',
  //   icon: 'settings',
  //   to: '/image-translation',
  // },
  {
    seperator: true,
  },
  {
    title: 'setup',
    caption: 'setup User Settings',
    icon: 'settings',
    to: '/user',
  },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  //userSettingStore.load();
  const language = localStorage.getItem('userLanguage');
  locale.value = language ?? 'ko-KR'; // locale.value = language ?? 'en-US';
});

onBeforeMount(() => {
  userSettingStore.load();
});
</script>

<template>
  <q-layout view="HHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Ranking One </q-toolbar-title>

        <div>User Name{{ ': ' + userName }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>{{ $t('Menus') }} </q-item-label>

        <template v-for="(menu, index) in menuItems" :key="index">
          <EssentialLink v-if="!menu.seperator" v-bind="menu" />
          <q-separator v-else />
        </template>

        <div class="q-pa-md absolute-bottom">
          <!-- <DarkmodeSWitcher /> -->
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
import { useUserAccountStore } from 'src/stores/user-account';
const leftDrawerOpen = ref(false);
const userName = ref('none');
const userAccountStore = useUserAccountStore();
const { locale } = useI18n({ useScope: 'global' });

const menuItems: EssentialLinkProps[] = [
  {
    title: 'product rank',
    caption: 'product ranking check',
    icon: 'favorite',
    // link: 'https://awesome.quasar.dev',
    to: '/productRank',
    seperator: false,
  },

  {
    title: 'setup',
    caption: 'setup user account',
    icon: 'settings',
    // link: '/user/UserTabs',
    to: '/userTabs',
    seperator: false,
  },
  {
    title: 'Contact',
    seperator: true, // <--- add this line
  },
  {
    title: 'twitter',
    caption: '@RankingOne',
    icon: 'rss_feed',
    // link: 'https://twitter.quasar.dev',
    link: 'https://twitter.rankingone.com',
    seperator: false,
  },
  {
    title: 'facebook',
    caption: '@RankingOne',
    icon: 'public',
    //link: 'https://facebook.quasar.dev',
    link: 'https://www.facebook.com/rankingone',
    seperator: false,
  },
  // {
  //   title: 'Docs',
  //   caption: 'quasar.dev',
  //   icon: 'school',
  //   link: 'https://quasar.dev',
  // },
  // {
  //   title: 'Github',
  //   caption: 'github.com/quasarframework',
  //   icon: 'code',
  //   link: 'https://github.com/quasarframework',
  // },
  // {
  //   title: 'Discord Chat Channel',
  //   caption: 'chat.quasar.dev',
  //   icon: 'chat',
  //   link: 'https://chat.quasar.dev',
  // },
  // {
  //   title: 'Forum',
  //   caption: 'forum.quasar.dev',
  //   icon: 'record_voice_over',
  //   link: 'https://forum.quasar.dev',
  // },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  //userAccountStore.load();
  const language = localStorage.getItem('userLanguage');
  console.log('language=', language);
  locale.value = language ?? 'en-US';
});

onBeforeMount(() => {
  userAccountStore.load();
});
</script>

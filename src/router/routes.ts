import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/ranking',
        component: () => import('pages/ranking/ProductRanking.vue'),
      },
      {
        path: '/image-translation',
        component: () => import('pages/image_translation/ImageTranslation.vue'),
      },
      {
        path: '/user',
        component: () => import('pages/user/UserTabs.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'campeonatos',
        component: () => import('src/pages/CampeonatosPage.vue'),
        children: [
          {
            path: ':id',
            component: () => import('src/pages/CampeonatosPage.vue'),
            children: [
              {
                path: ':squadId',
                component: () => import('src/pages/CampeonatosPage.vue'),
              },
            ],
          },
        ],
      },
      {
        path: 'configuracoes',
        component: () => import('pages/Configuracoes.vue'),
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

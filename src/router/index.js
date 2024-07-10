import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from '@auth0/auth0-vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: "/assignr-assignor",
    name: "AssignrAssignor",
    component: () => import("@/views/AssignrAssignor.vue"),
    beforeEnter: authGuard
  },
  {
    path: "/assignr-referee",
    name: "AssignrReferee",
    component: () => import("@/views/AssignrReferee.vue"),
    beforeEnter: authGuard
  },
  {
    path: "/spring2024rules",
    name: "CYSLSpring2024Rules",
    component: () => import("@/views/GameRules2024.vue"),
  },
  {
    path: "/field-coordinator",
    name: "FieldCoordinator",
    component: () => import("@/views/FieldGames.vue"),
//    beforeEnter: authGuard
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/pages/Profile.vue"),
  },
  {
    path: "/call",
    name: "TheCall",
    component: () => import("@/views/TheCall.vue"),
  },
  {
    path: "/callback",
    name: "CallBack",
    component: () => import("@/pages/CallPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/NotFound.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

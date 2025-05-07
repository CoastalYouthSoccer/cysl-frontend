import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";
import { roleGuard } from "@/auth/authGuard";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: '/admin',
    children: [
      { path: 'association', name: 'Association',
        component: () => import("@/components/association/AssociationData.vue") },
      { path: 'game', name: 'Game',
        component: () => import("@/components/game/GameData.vue") },
      { path: 'season', name: 'Season',
        component: () => import("@/components/season/SeasonData.vue") },
      { path: 'venue', name: 'Venue',
        component: () => import("@/components/venue/VenueData.vue") },
    ],
    beforeEnter: [authGuard, roleGuard(['admin'])]
  },
  {
    path: '/assignor',
    children: [
      { path: 'assignr-documentation', name: 'AssignrDocumentation',
        component: () => import("@/views/AssignrAssignor.vue" },
      { path: 'field-coordinator', name: 'FieldCoordinator',
        component: () => import("@/views/FieldGames.vue") },
    ],
    beforeEnter: [authGuard, roleGuard(['admin', 'assignor'])]
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
    beforeEnter: authGuard
    ,
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/pages/Profile.vue"),
    beforeEnter: authGuard
  },
  {
    path: "/call",
    name: "TheCall",
    component: () => import("@/views/TheCall.vue"),
    beforeEnter: [authGuard,roleGuard(['admin', 'assignor', 'referee'])]
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

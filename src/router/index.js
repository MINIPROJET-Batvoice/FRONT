import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TranscriptionFormView from "../components/TranscriptionForm.vue";
import Login from "../components/LoginForm.vue";
import registration from "../components/RegistrationForm.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: registration,
  },
  {
    path: "/transcription", // Assurez-vous que le chemin est correct
    name: "transcriptionForm",
    component: TranscriptionFormView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

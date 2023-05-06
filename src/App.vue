<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import Header from '@/shared/ui/Header.vue';
import styles from './App.module.scss';

const HIDE_SIDEBAR_ROUTES = ['login', 'chat'];

const { currentRoute } = useRouter();


</script>

<template>
  
  <Header></Header>
  <main :class=styles.main >
    <aside 
      :class=styles.aside 
      v-if='currentRoute.name && !HIDE_SIDEBAR_ROUTES.includes(<string>currentRoute.name)' 
    >
      <nav :class=styles.nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/chat">Chat</RouterLink>
        <RouterLink to="/tasks">Tasks</RouterLink>
      </nav>
    </aside>
    <RouterView />
  </main>
  
</template>
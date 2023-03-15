<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Header from '@/shared/ui/Header.vue';
import styles from './App.module.scss';

</script>

<template>
  <Header></Header>
  <main :class=styles.main>
    <aside :class=styles.aside>
      <nav :class=styles.nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/tasks">Tasks</RouterLink>
      </nav>
    </aside>
    <RouterView />
  </main>
</template>
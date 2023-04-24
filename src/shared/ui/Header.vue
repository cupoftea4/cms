<script setup lang="ts">
import { onMounted, ref } from 'vue';
import styles from './Header.module.scss';
import BellIcon from '@/shared/ui/icons/BellIcon.vue';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue3-toastify';

const notifications = ref(["aaa", "bbb"]);
const userStore = useUserStore();

onMounted(() => {
  userStore.updateProfileIfExists();
});

function logout() {
  userStore.logout().then(() => {
    toast.warn("You logged out");
  });
}


</script>

<template>
  <header :class=styles.header>
    <h1>CMS</h1>
    <span :class="styles['header-left']" @click="" >
      <div class="hover-panel">
        <button :class=styles.bell>
          <BellIcon/>
        </button>
        <div class="panel">
          <ul>
            <li v-for='notification in notifications' :key=notification>
              <button>{{ notification }}</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="hover-panel">
        <div :class=styles.user>
          <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" height="34" width="34" />
          <RouterLink v-if=userStore.user to="/profile">{{ userStore.user.name }}</RouterLink>
          <RouterLink v-else to="/login">Log In</RouterLink>
        </div>
        <div class="panel">
          <ul>
            <li>
              <button @click=logout>Log Out</button>
            </li>
          </ul>
        </div>
      </div>
    </span>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import styles from './Header.module.scss';
import BellIcon from '@/shared/ui/icons/BellIcon.vue';

const notifications = ref(["aaa", "bbb"]);

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
          <img class="user__img" src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" height="34" width="34" />
          <p class="user__name">John Doe</p>
        </div>
        <div class="panel">
          <ul>
            <li v-for='notification in notifications' :key=notification>
              <button>{{ notification }}</button>
            </li>
          </ul>
        </div>
      </div>
    </span>
  </header>
</template>


<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import LoadingIcon from '@/shared/ui/icons/LoadingIcon.vue';
import styles from './AuthView.module.scss';

type User = {
  name?: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}

type AuthProvider = "google" | "github";

const isRegister = ref(false);
const isLoading = ref(false);
const user = ref<User>({ name: "", email: "", password: "" });
const userStore = useUserStore();


const label = computed(() => isRegister.value ? "Register" : "Log In");

const switchMode = () => {
  isRegister.value = !isRegister.value;
}

function handlePostMessage(ev: MessageEvent<{token: string, name: string, id: number, email: string}>) {
  if (ev.data.token) {
    const user = {name: ev.data.name, id: ev.data.id, email: ev.data.email, avatar: null};
    userStore.updateProfile(user, ev.data.token);
    router.push("/");
    toast.success("Logged in successfully");
    isLoading.value = false;
  }
}

onMounted(() => {
  window.addEventListener('message', handlePostMessage, false)
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handlePostMessage, false)
});

function validateUser(data: User, isRegister: boolean) {
  if (!data.email || data.email.length < 3) {
    return "Email must be at least 3 characters";
  }
  if (!data.password || data.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (isRegister) {
    if (data.password !== data.passwordConfirmation) {
      return "Passwords do not match";
    }
    if (!data.name || data.name.length < 3) {
      return "Name must be at least 3 characters";
    }
  }
  return true;
}

async function auth(provider?: AuthProvider) {
  const data = user.value;
  isLoading.value = true;

  try {
    if (provider) {
      await userStore.loginWithProvider(provider);
    } else {
      const validation = validateUser(data, isRegister.value);
      if (validation !== true) throw new Error(validation);

      await (isRegister.value
        ? userStore.register(data.name!, data.email, data.password)
        : userStore.login(data.email, data.password));
      
      router.push("/");
      toast.success("Logged in successfully");
    }

  } catch (err) {
    toast.error((err as Error).message);
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div :class='styles["full-screen"]'>
    <div :class='styles["form-modal"]'>
      <h1>{{ label }}</h1>
      <div :class=styles.form>
        <div v-if=isRegister>
          <label for="name">Name</label>
          <input v-model=user.name placeholder="Cinnamon Roll" type="text" name="name" />
        </div>
        <div>
          <label for="email">Email</label>
          <input v-model=user.email placeholder="example@gmail.com" type="email" name="email" id="email" />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model=user.password placeholder="uT5&hNNY69%#1" type="password" id="password" />
        </div>
        <div v-if=isRegister>
          <label for="password">Confirm Password</label>
          <input v-model=user.passwordConfirmation placeholder="uT5&hNNY69%#1" type="password" id="password" />
        </div>
          <button :class=styles.continue @click=auth() >
            <LoadingIcon v-if=isLoading></LoadingIcon>
            <span v-else>{{ label }}</span>
          </button>
          <div :class=styles.bottom>
            <p v-if=isRegister>Already have an account? <button @click=switchMode :class=styles.switch>Log in</button></p>
            <p v-else>New here? <button @click=switchMode :class=styles.switch>Create account</button></p>
          </div>
          <button class="google-sign-in-button" @click='auth("google")'>
            Sign in with Google
          </button>
        </div>
    </div>
  </div>
</template>
<style scoped>


.google-sign-in-button {
  cursor: pointer;
  transition: background-color .3s, box-shadow .3s;
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.625rem;
  border: none;
  border-radius: .25rem;
  margin-top: 1rem;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
  
  color: #3e3d3d;
  font-weight: 500;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 13px;
}

.google-sign-in-button:hover {
  background-color: #f2f1f1;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25);
}

</style>

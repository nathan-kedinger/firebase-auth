<script setup lang="ts">
import {navbarPagesList} from "../utils/constants/navbarPagesList";
import { onMounted, ref } from "vue";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import router from "../router";
import axios from "axios";

const isLoggedIn = ref<boolean>(false)
const auth = ref()
const logout = {
  url:  "http://localhost:8051/logout",
  method: "POST",
};
const handleSignOut = () => {
  signOut(auth.value).then(() => {
    localStorage.removeItem('token');
    axios({
      method: logout.method,
      url: logout.url,
    }).then(
      (response) => {
        console.log(response)
      }
    ).catch((error) => {
      console.log(error)
    })
    router.push('/register')
  })
}

onMounted(() => {
  auth.value = getAuth()
  onAuthStateChanged(auth.value, (user) => {
    isLoggedIn.value = !!user;
  })
})
</script>

<template>
  <div class="navbar bg-base-100">
    <a v-for="page in navbarPagesList" class="btn btn-ghost text-xl"><RouterLink :to="page.path">{{ page.page }}</RouterLink></a>
    <a class="btn btn-ghost text-xl" @click="handleSignOut" v-if="isLoggedIn">Sign out</a>
  </div>
</template>

<style scoped>

</style>
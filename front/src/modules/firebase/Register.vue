<script setup lang="ts">
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref<string>("");
const password = ref<string>("");
const router = useRouter();
const user = ref(null);
const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log(data);
        console.log("Enregistrement réussi");
        router.push("/");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
      .then((result) => {
        console.log("resultat", result);
        router.push("/feed");
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
      });
};

</script>

<template>
  <h1>Créer un compte</h1>
  <p><input type="text" placeholder="Courriel" v-model="email" /></p>
  <p><input type="password" placeholder="Mot de passe" v-model="password" /></p>
  <button @click="register">S'inscrire</button>
  <p><button @click="signInWithGoogle">Se connecter avec Google</button></p>
</template>

<style scoped></style>


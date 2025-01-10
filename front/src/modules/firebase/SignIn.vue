<script setup lang="ts">
import {ref} from "vue";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useRouter} from "vue-router";

const email = ref<string>("")
const password = ref<string>("")
const errorMessage = ref<string>("")
const router = useRouter()

const signInWithGoogle = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((idToken) => {
        localStorage.setItem("token", idToken.user?.uid)
        console.log("sign in succes")
      })
      .catch((error) => {
        console.log(error.code)
        switch (error.code){
          case "auth/invalid-email":
            errorMessage.value = "Invalid email"
            break
          case "auth/user-not-found":
            errorMessage.value = "No account with that email was found"
            break
          case "auth/wrong-password":
            errorMessage.value = "Wrong password"
            break
          default :
            errorMessage.value = "Email or password were incorrect"
            break
        }
        alert(error.message)
      })
  router.push("/feed")
}
</script>

<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="text" placeholder="password" v-model="password" /></p>
  <p v-if="errorMessage">{{errorMessage}}</p>
  <button @click="signInWithGoogle">Sign in</button>
</template>

<style scoped>

</style>
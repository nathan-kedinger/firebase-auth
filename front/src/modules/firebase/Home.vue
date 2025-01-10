<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Message} from "../message/type.ts";
import {getMessagesList} from "../message/api/Message.ts";
import type { User } from "../security/types/User.ts";
import {getAuthenticatedUser} from "../security/api/Authentication.ts";

  const messageList = ref<Message[]>([])
  const currentUser = ref<User | null>(null)
  onMounted(async () => {
    messageList.value = await getMessagesList()
    currentUser.value = await getAuthenticatedUser()
    console.log("Message list : ",messageList.value);
    console.log("current user : ", currentUser.value);
  })
</script>

<template>

</template>

<style scoped>

</style>
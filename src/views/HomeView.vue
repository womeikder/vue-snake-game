<script setup>
import GameMain from "@/components/GameMain.vue";
import {ref} from "vue";
import GameStart from "@/components/GameStart.vue";
const running = ref(false)

const onChangeStatus = (status) => {
  if (status === 1) {
    running.value = true
  } else if (status === 0) {
    window.opener = null
    window.close()
  }
}

</script>

<template>
  <div>
    <GameMain  v-if="running"></GameMain>
    <GameStart @start="onChangeStatus(1)" @exit="onChangeStatus(0)" v-else></GameStart>
  </div>
</template>

<script setup>
const emit = defineEmits(['start', 'exit'])

const onStart = () => {
  emit('start')
}
const onExit = () => {
  emit('exit')
}

</script>

<template>
  <div class="main">
    <div @click="onStart" class="start"></div>
    <div @click="onExit" class="exit"></div>
  </div>
</template>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/image/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  .start {
    width: 320px;
    height: 110px;
    background-image: url("@/assets/image/start-button.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    left: 480px;
    bottom: 200px;
    cursor: pointer;
  }
  .exit {
    width: 320px;
    height: 130px;
    background-image: url("@/assets/image/exit-button.png");
    background-size: 310px;
    background-repeat: no-repeat;
    position: absolute;
    left: 900px;
    bottom: 185px;
    cursor: pointer;
  }
}
</style>
<template>
  <footer>
    <div class="controls">
      <button>Start/Stop</button>
      <button @click="$emit('step')">Step</button>
      <button>Presets</button>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style scoped>
footer {
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid black;
  padding: 10px;
  background: rgba(211, 211, 211, 0.6);
  z-index: 1;
}
</style>

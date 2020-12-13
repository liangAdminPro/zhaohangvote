<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  created() {}
};
</script>

<style>
#app {
  font-family: "Microsoft YaHei" !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background-color: #f1f1f1;
}
html.body {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}
img {
  object-fit: fill;
}
</style>

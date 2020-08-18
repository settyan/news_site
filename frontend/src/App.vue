<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    titleTemplate: "%s | 評価型ニュースサイト"
  }
};
</script>

<style lang="scss">
html {
  font-size: 62.5%;
}

body {
  font-family: "游ゴシック", YuGothic, "Hiragino Sans",
    "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  -webkit-font-feature-settings: "palt";
  font-feature-settings: "palt";
  -webkit-font-smoothing: antialiased;
}
</style>

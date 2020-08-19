<template>
  <div id="app" class="wrapper">
    <header class="header">
      <div class="header__inner">
        <div class="header__logo">
          <router-link to="/">
            <img
              srcset="@/assets/logo@2x.png 2x, @/assets/logo.png 1x"
              src="@/assets/logo.png"
              alt=""
            />
          </router-link>
        </div>
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-item">
              <router-link to="/" class="header__nav-link">Home</router-link>
            </li>
            <li class="header__nav-item">
              <router-link to="/about" class="header__nav-link"
                >About</router-link
              >
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__copyright">© 2020 7班</p>
      </div>
    </footer>
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
  color: #333;
  -webkit-font-feature-settings: "palt";
  font-feature-settings: "palt";
  -webkit-font-smoothing: antialiased;
}
</style>

<style lang="scss" scoped>
.wrapper {
  max-width: 1000px;
  margin: 0 auto;

  @media screen and (max-width: 1200px) {
    padding: 0 20px;
  }
}
.header {
  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4rem 0;

    @media screen and (max-width: 767px) {
      padding: 3.2rem 0;
    }
  }
  &__logo {
    img {
      @media screen and (max-width: 767px) {
        width: 6.8rem;
      }
    }
  }
  &__nav {
    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
    }
    &-item {
      margin-left: 4rem;
      font-size: 1.8rem;

      @media screen and (max-width: 767px) {
        font-size: 1.6rem;
      }
    }
    &-link {
      color: #409eff;
      text-decoration: none;
      opacity: 0.6;

      &:hover,
      &.router-link-exact-active {
        opacity: 1;
      }
    }
  }
}
.footer {
  text-align: center;

  &__inner {
    padding: 4rem 0;

    @media screen and (max-width: 767px) {
      padding: 3.2rem 0;
    }
  }
}
</style>

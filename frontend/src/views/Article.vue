<template>
  <div class="root">
    <template v-if="isLoadingHeadline">
      <div class="article">
        <header class="article__header">
          <h2>
            <PuSkeleton height="4rem" />
          </h2>
          <div class="article__meta">
            <p class="article__date">
              <PuSkeleton width="6rem" />
            </p>
            <p class="article__author">
              <PuSkeleton width="6rem" />
            </p>
          </div>
        </header>
        <div class="article__imgbox">
          <PuSkeleton class="article__img" />
        </div>
        <div class="article__content">
          <PuSkeleton height="6rem" />
        </div>
      </div>
    </template>
    <div v-else class="article">
      <header class="article__header">
        <h2>
          {{ article.title }}
        </h2>
        <div class="article__meta">
          <p class="article__date">
            <i class="el-icon-date"></i>{{ time(article.publishedAt) }}
          </p>
          <p class="article__author">By.{{ article.source.name }}</p>
        </div>
      </header>
      <div class="article__imgbox">
        <el-image
          class="article__img"
          :src="article.image"
          fit="cover"
          lazy
        ></el-image>
      </div>
      <div class="article__content">
        <p class="article__description">{{ article.description }}</p>
        <p class="article__links">
          <a
            class="article__link"
            :href="article.url"
            target="_blank"
            rel="noopener noreferrer"
            >{{ article.url }}</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import Skeleton from "vue-loading-skeleton";

Vue.use(Skeleton);

export default {
  name: "Article",
  metaInfo() {
    return {
      title: this.id
    };
  },
  data() {
    return {
      id: this.$route.params.id,
      isLoading: true
    };
  },
  methods: {
    time: function(time) {
      time = time.replace(/(.*) UTC/, "$1");
      return moment
        .utc(time)
        .local()
        .format("YYYY/MM/DD");
    }
  },
  computed: {
    isLoadingHeadline() {
      return this.$store.getters.getIsLoadingHeadline;
    },
    headlineSize() {
      return this.$store.getters.getHeadlineSize;
    },
    headline() {
      return this.$store.getters.getHeadline;
    },
    article() {
      return this.headline.find(article => article.title === this.id);
    }
  },
  created() {
    this.headlineSize < 1 &&
      this.$store.dispatch("fetchHeadline").catch(err => {
        this.$message({
          message: err,
          type: "error"
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.article {
  padding: 0 12rem;

  @media screen and (max-width: 767px) {
    padding: 0;
  }

  &__header {
    margin-bottom: 4rem;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin: 1rem 0 0;
    overflow: hidden;
    white-space: nowrap;
  }

  &__author,
  &__date {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    opacity: 0.6;
    margin: 0 1rem 0 0;

    i {
      margin-right: 0.6rem;
    }
  }

  &__imgbox {
    padding-top: 64%;
    position: relative;
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__content {
    margin-top: 4rem;
  }

  &__link {
    color: #409eff;
  }
}
</style>

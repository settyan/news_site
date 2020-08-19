<template>
  <div class="root">
    <template v-if="isLoading">
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
          <PuSkeleton height="40rem" />
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
      <div class="article__img">
        <el-image
          style="width: 100%; height: 40rem"
          :src="article.urlToImage"
          fit="cover"
          lazy
        ></el-image>
      </div>
      <div class="article__content">
        <template v-html="article.content"></template>
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
      isLoading: true,
      article: null
    };
  },
  computed: {
    title: function() {
      return this.id.match(/(.*) - /)[1];
    },
    source: function() {
      return this.id.match(/ - (.*)/)[1];
    }
  },
  methods: {
    time: function(time) {
      return moment(time).format("YYYY/MM/DD");
    },
    fetchArticles: function() {
      this.isLoading = true;
      fetch(
        `${process.env.VUE_APP_PROXY_URL}/${process.env.VUE_APP_API_URL}/v2/everything?apiKey=${process.env.VUE_APP_API_KEY}&qInTitle="${this.title}"`
      )
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.article = json.articles[0];
          this.isLoading = false;
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>

<style lang="scss" scoped>
.article {
  padding: 0 12rem;

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

  &__content {
    margin-top: 4rem;
  }
}
</style>

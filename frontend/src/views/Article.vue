<template>
  <div class="root">
    <div class="article">
      <header class="article__header">
        <h2>{{ article.title }}</h2>
        <div class="article__meta">
          <p class="article__date">
            <i class="el-icon-date"></i
            ><span>{{ time(article.publishedAt) }}</span>
          </p>
          <p class="article__author">
            By.<span>{{ article.source.name }}</span>
          </p>
        </div>
      </header>
      <div>
        <el-image
          style="width: 100%; height: 40rem"
          :src="article.urlToImage"
          fit="cover"
          lazy
        ></el-image>
      </div>
      <div class="article__content" v-html="article.content"></div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

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
        `${process.env.VUE_APP_API_URL}/v2/everything?apiKey=${process.env.VUE_APP_API_KEY}&qInTitle="${this.title}"`
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

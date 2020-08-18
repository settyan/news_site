<template>
  <div class="home">
    <el-row :gutter="40" v-if="isLoading">
      <el-col :span="8" v-for="(article, index) in articles" :key="index">
        <div class="card">
          <el-card :body-style="{ padding: '0px' }">
            <div class="card__imgbox">
              <img :src="article.urlToImage" class="card__img" />
            </div>
            <div class="card__inner">
              <h2 class="card__title">{{ article.title }}</h2>
              <p class="card__excerpt">{{ article.description }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <div v-else>Fuck</div>
  </div>
</template>

<script>
export default {
  name: "Home",
  metaInfo: {
    titleTemplate: "評価型ニュースサイト"
  },
  data() {
    return {
      articles: []
    };
  },
  computed: {
    isLoading: function() {
      return this.articles.length > 0;
    }
  },
  created() {
    fetch(
      `${process.env.VUE_APP_API_URL}/v2/top-headlines?country=jp&apiKey=${process.env.VUE_APP_API_KEY}&pageSize=15`
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.articles = json.articles;
      })
      .catch(err => {
        this.$message({
          message: err,
          type: "error"
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 4rem;

  &__inner {
    padding: 2rem;
  }

  &__img {
    width: 100%;
    height: 20rem;
    object-fit: cover;
    object-position: center;
  }

  &__title {
    margin: 0 0 1rem;
    font-size: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__excerpt {
    margin: 0;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

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
              <div class="card__meta">
                <p class="card__author" v-if="article.author">
                  <i class="el-icon-user"></i><span>{{ article.author }}</span>
                </p>
                <p class="card__date">
                  <i class="el-icon-date"></i
                  ><span>{{ time(article.publishedAt) }}</span>
                </p>
              </div>
              <p class="card__excerpt">{{ article.description }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <div v-else>Now searching fucking hard...</div>
  </div>
</template>

<script>
import moment from "moment";

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
  methods: {
    time: function(time) {
      return moment(time).format("YYYY/MM/DD");
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
    margin: 0;
    font-size: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin: 1rem 0 0;
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

  &__excerpt {
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1.6rem 0 0;
  }
}
</style>

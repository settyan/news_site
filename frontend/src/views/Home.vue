<template>
  <div class="root">
    <div v-if="isLoading">Now searching fucking hard...</div>
    <div v-else>
      <el-row :gutter="40">
        <el-col
          :span="8"
          v-for="(article, index) in articles"
          :key="index"
          class="col"
        >
          <div class="card">
            <router-link :to="`/items/${article.title}`" class="card__link">
              <el-card :body-style="{ padding: '0px' }">
                <div class="card__imgbox">
                  <el-image
                    style="width: 100%; height: 20rem"
                    :src="article.urlToImage"
                    fit="cover"
                    lazy
                  ></el-image>
                </div>
                <div class="card__inner">
                  <h2 class="card__title">{{ article.title }}</h2>
                  <div class="card__meta">
                    <p class="card__date">
                      <i class="el-icon-date"></i
                      ><span>{{ time(article.publishedAt) }}</span>
                    </p>
                    <p class="card__author">
                      By.<span>{{ article.source.name }}</span>
                    </p>
                  </div>
                  <p class="card__excerpt">{{ article.description }}</p>
                </div>
              </el-card>
            </router-link>
          </div>
        </el-col>
      </el-row>
      <div class="pagenation">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalResults"
          :current-page.sync="currentPage"
          hide-on-single-page
          @current-change="fetchArticles"
        >
        </el-pagination>
      </div>
    </div>
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
      isLoading: true,
      articles: [],
      pageSize: 15,
      totalResults: 0,
      currentPage: 1
    };
  },
  methods: {
    time: function(time) {
      return moment(time).format("YYYY/MM/DD");
    },
    fetchArticles: function() {
      this.isLoading = true;
      fetch(
        `${process.env.VUE_APP_API_URL}/v2/top-headlines?country=jp&apiKey=${process.env.VUE_APP_API_KEY}&pageSize=${this.pageSize}&page=${this.currentPage}`
      )
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.totalResults = json.totalResults;
          this.articles = json.articles;
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
.col:nth-child(3n + 1) {
  clear: both;
}
.card {
  margin-bottom: 4rem;

  &__link {
    color: inherit;
    text-decoration: none;
  }

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
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin: 1rem 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
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

  &__excerpt {
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1.6rem 0 0;
  }
}
.pagenation {
  text-align: center;
}
</style>

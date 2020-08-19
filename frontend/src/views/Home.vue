<template>
  <div class="root">
    <template v-if="isLoading">
      <el-row :gutter="40">
        <el-col :sm="12" :lg="8" v-for="index in 6" :key="index" class="col">
          <div class="card">
            <el-card :body-style="{ padding: '0px' }">
              <div class="card__imgbox">
                <PuSkeleton class="card__img" />
              </div>
              <div class="card__inner">
                <h2 class="card__title"><PuSkeleton /></h2>
                <div class="card__meta">
                  <p class="card__date">
                    <PuSkeleton width="6rem" />
                  </p>
                  <p class="card__author">
                    <PuSkeleton width="6rem" />
                  </p>
                </div>
                <p class="card__excerpt">
                  <PuSkeleton />
                </p>
              </div>
            </el-card>
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
    </template>
    <template v-else>
      <el-row :gutter="40">
        <el-col
          :sm="12"
          :lg="8"
          v-for="(article, index) in articles"
          :key="index"
          class="col"
        >
          <div class="card">
            <router-link :to="`/items/${article.title}`" class="card__link">
              <el-card :body-style="{ padding: '0px' }">
                <div class="card__imgbox">
                  <el-image
                    class="card__img"
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
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import Skeleton from "vue-loading-skeleton";

Vue.use(Skeleton);

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
        `${process.env.VUE_APP_PROXY_URL}/${process.env.VUE_APP_API_URL}/v2/top-headlines?country=jp&apiKey=${process.env.VUE_APP_API_KEY}&pageSize=${this.pageSize}&page=${this.currentPage}`
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
.col {
  &:nth-child(3n + 1) {
    clear: both;

    @media screen and (max-width: 1199px) {
      clear: none;
    }
  }
  &:nth-child(2n + 1) {
    @media screen and (max-width: 1199px) {
      clear: both;
    }
    @media screen and (max-width: 767px) {
      clear: none;
    }
  }
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

  &__imgbox {
    line-height: 1;
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

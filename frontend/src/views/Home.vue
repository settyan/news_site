<template>
  <div class="root">
    <template v-if="isLoadingHeadline">
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
    </template>
    <template v-else-if="articles">
      <el-row :gutter="40">
        <el-col
          :sm="12"
          :lg="8"
          v-for="(article, index) in articles"
          :key="index"
          class="col"
        >
          <div class="card">
            <router-link
              :to="
                `/items/${article.source.name}/${article.publishedAt}/${article.title}`
              "
              class="card__link"
            >
              <el-card :body-style="{ padding: '0px' }">
                <div class="card__imgbox">
                  <el-image
                    class="card__img"
                    :src="article.image"
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
          :total="headlineSize"
          :current-page.sync="currentPage"
          hide-on-single-page
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </template>
    <template v-else>
      <h2 class="title">記事が見つかりませんでした</h2>
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
      pageSize: 15,
      currentPage: 1
    };
  },
  methods: {
    time: function(time) {
      time = time.replace(/(.*) UTC/, "$1");
      return moment
        .utc(time)
        .local()
        .format("YYYY/MM/DD");
    },
    handleCurrentChange() {
      scrollTo(0, 0);
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
    startPage() {
      return this.pageSize * (this.currentPage - 1);
    },
    endPage() {
      return this.pageSize * this.currentPage;
    },
    articles() {
      return this.headline.slice(this.startPage, this.endPage);
    }
  },
  created() {
    this.isLoadingHeadline &&
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

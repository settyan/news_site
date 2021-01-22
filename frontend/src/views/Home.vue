<template>
  <div class="root">
    <template v-if="isLoadingHeadline">
      <el-row :gutter="40">
        <el-col :sm="12" :lg="8" v-for="index in 6" :key="index" class="col">
          <CardSkeleton />
        </el-col>
      </el-row>
    </template>
    <template v-else-if="articles.length > 0">
      <el-row :gutter="40">
        <el-col
          :sm="12"
          :lg="8"
          v-for="(article, index) in articles"
          :key="index"
          class="col"
        >
          <Card
            :id="article.sys.id"
            :eyecatch="article.fields.eyecatch.fields.file.url"
            :title="article.fields.title"
            :date="article.fields.date"
            :author="article.fields.author"
            :media="article.fields.source"
            :excerpt="article.fields.excerpt"
          />
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
import Card from "@/components/Card";
import CardSkeleton from "@/components/CardSkeleton";

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
  },
  components: {
    Card,
    CardSkeleton
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
.pagenation {
  text-align: center;
}
</style>

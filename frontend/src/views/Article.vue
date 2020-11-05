<template>
  <div class="root">
    <template v-if="isLoading">
      <div class="article">
        <header class="article__header">
          <h2 class="article__title">
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
    <template v-else-if="article">
      <div class="article">
        <header class="article__header">
          <h2 class="article__title">
            {{ article.fields.title }}
          </h2>
          <div class="article__meta">
            <p class="article__date">
              <i class="el-icon-date"></i>{{ time(article.fields.date) }}
            </p>
            <p class="article__author" v-if="article.fields.author">
              By.{{ article.fields.author }}
            </p>
            <p class="article__media" v-if="article.fields.source">
              {{ article.fields.source }}
            </p>
          </div>
          <div class="article__rate">
            <el-rate value="3.5" disabled />
            <p>114514票の評価</p>
          </div>
        </header>
        <div class="article__imgbox">
          <el-image
            class="article__img"
            :src="article.fields.eyecatch.fields.file.url"
            fit="cover"
            lazy
          ></el-image>
        </div>
        <div class="article__content" v-html="body"></div>
        <p class="article__links">
          <a
            class="article__link"
            :href="article.fields.original"
            target="_blank"
            rel="noopener noreferrer"
            >{{ article.fields.original }}</a
          >
        </p>
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
import { createClient } from "../lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const client = createClient();

Vue.use(Skeleton);

export default {
  name: "Article",
  metaInfo() {
    return {
      title: this.article.fields.title
    };
  },
  data() {
    return {
      id: this.$route.params.id,
      isLoading: true,
      article: undefined
    };
  },
  methods: {
    time(time) {
      const newTime = time.replace(/(.*) UTC/, "$1");
      return moment
        .utc(newTime)
        .local()
        .format("YYYY/MM/DD");
    },
    isArticle(article) {
      return article.title === this.id && article.title === this.id;
    },
    getArticle() {
      return client.getEntry(this.id);
    }
  },
  computed: {
    headline() {
      return this.$store.getters.getHeadline;
    },
    body() {
      return documentToHtmlString(this.article.fields.body);
    }
  },
  async created() {
    this.article =
      this.headline.find(article => article.sys.id === this.id) ||
      (await this.getArticle());

    this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped>
.root {
  padding: 0 12rem;

  @media screen and (max-width: 767px) {
    padding: 0;
  }
}

.article {
  &__header {
    margin-bottom: 4rem;
  }

  &__title {
    margin: 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin: 1.4rem 0 0;
    overflow: hidden;
    white-space: nowrap;
  }

  &__author,
  &__date,
  &__media {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    opacity: 0.6;
    margin: 0 1rem 0 0;

    i {
      margin-right: 0.6rem;
    }
  }

  &__rate {
    margin: 1.6rem 0 0;
    display: flex;
    align-items: center;
    color: #858585;

    p {
      margin: 0;
      letter-spacing: 0.05em;
      font-size: 1.4rem;
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
    margin: 4rem 0;
    line-height: 1.75;
  }

  &__link {
    color: #409eff;
  }
}
</style>

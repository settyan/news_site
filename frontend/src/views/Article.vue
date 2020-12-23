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
        <div class="article__content">{{ article.fields.excerpt }}</div>
        <p class="article__links">
          <a
            class="article__link"
            :href="article.fields.original"
            target="_blank"
            rel="noopener noreferrer"
            >{{ article.fields.original }}</a
          >
        </p>
        <div class="article__footer">
          <div class="rate">
            <div class="rate__inner">
              <div class="rate__content">
                <h3 class="rate__title">信憑性を評価してください</h3>
                <el-rate v-model="rate"></el-rate>
              </div>
              <div class="rate__buttons">
                <el-button
                  class="rate__button"
                  size=""
                  type="warning"
                  :disabled="rate < 1"
                  >評価する</el-button
                >
              </div>
            </div>
          </div>
          <div class="comment">
            <h3 class="comment__title">コメントを投稿する</h3>
            <div class="comment__content">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="コメント内容"
                v-model="comment"
              >
              </el-input>
            </div>
            <div class="comment__buttons">
              <el-button type="primary" :disabled="!comment"
                >投稿する</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <h2 class="title">記事が見つかりませんでした</h2>
    </template>
    <div class="comment-area" id="comment-area"></div>
  </div>
</template>

<script>
import Vue from "vue";
import dayjs from "dayjs";
import Skeleton from "vue-loading-skeleton";
import { createClient } from "@/lib/contentful";
import nicojs from "nicojs";
import comment from "@/config/comment.json";

const client = createClient();

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

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
      article: undefined,
      rate: 0,
      comment: "",
      nico: null
    };
  },
  methods: {
    time(time) {
      return dayjs(time).format("YYYY/MM/DD");
    },
    isArticle(article) {
      return article.title === this.id && article.title === this.id;
    },
    getArticle() {
      return client.getEntry(this.id);
    },
    handleOnResize() {
      if (!window) return;
      this.nico.resize(window.innerWidth, window.innerHeight);
    },
    initCommentArea() {
      this.nico = new nicojs({
        app: document.getElementById("comment-area"),
        width: window.innerWidth,
        height: window.innerHeight,
        font_size: 50,
        color: "#333"
      });
      this.nico.loop(shuffle(comment));
    }
  },
  computed: {
    headline() {
      return this.$store.getters.getHeadline;
    }
  },
  async created() {
    this.article =
      this.headline.find(article => article.sys.id === this.id) ||
      (await this.getArticle());

    this.isLoading = false;
  },
  mounted() {
    this.initCommentArea();
    window.addEventListener("resize", this.handleOnResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleOnResize);
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

  &__footer {
    margin-top: 5rem;
  }
}

.rate {
  background: #f7f7f7;
  padding: 2.8rem 10rem;
  border-radius: 0.4rem;

  &__inner {
    max-width: 40rem;
    margin: 0 auto;
  }

  &__content {
    background: #fff;
    padding: 4rem;
    text-align: center;
    border-radius: 0.4rem;
  }

  &__title {
    margin: 0 0 2rem;
    color: rgb(95, 95, 95);
  }

  &__buttons {
    margin-top: 2rem;
  }

  ::v-deep &__button {
    width: 100%;
    padding: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.comment {
  margin-top: 4rem;

  &__buttons {
    margin-top: 2rem;
  }
}

.comment-area {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}
</style>

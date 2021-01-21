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
          <div class="article__header-main">
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
          </div>
          <div class="article__header-footer">
            <div class="article__rate">
              <div class="article__rate-inner">
                <p class="article__rate-num">{{ rate }}</p>
                <el-rate :value="rate" disabled />
                <p class="article__rate-text">{{ rateCount }}票の評価</p>
              </div>
            </div>
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
          <el-button
            class="article__link"
            type="primary"
            @click="handleOnLinkClick"
            >本文を読む</el-button
          >
        </p>
        <div class="article__footer">
          <div class="rate" :class="isAddedRate && 'is-added'">
            <div class="rate__inner">
              <div class="rate__content">
                <h3 class="rate__title">信憑性を評価してください</h3>
                <el-rate v-model="fields.rate"></el-rate>
              </div>
              <div class="rate__buttons">
                <el-button
                  class="rate__button"
                  size=""
                  type="warning"
                  :disabled="fields.rate < 1 || isAddingRate"
                  @click="handleAddRate"
                  >評価する</el-button
                >
              </div>
            </div>
          </div>
          <div
            class="stamp-container"
            :class="(isAddingStamp || addedStamp) && 'is-disabled'"
          >
            <div class="stamp is-smile" :class="isAddedStamp(1) && 'is-added'">
              <font-awesome-icon icon="smile" @click="handleAddStamp(1)" />
              <span>{{ stamp.smile }}</span>
            </div>
            <div class="stamp is-sad" :class="isAddedStamp(2) && 'is-added'">
              <font-awesome-icon icon="sad-tear" @click="handleAddStamp(2)" />
              <span>{{ stamp.crying }}</span>
            </div>
            <div class="stamp is-angry" :class="isAddedStamp(3) && 'is-added'">
              <font-awesome-icon icon="angry" @click="handleAddStamp(3)" />
              <span>{{ stamp.anger }}</span>
            </div>
            <div
              class="stamp is-surprise"
              :class="isAddedStamp(4) && 'is-added'"
            >
              <font-awesome-icon icon="surprise" @click="handleAddStamp(4)" />
              <span>{{ stamp.surprise }}</span>
            </div>
            <div
              class="stamp is-thinking"
              :class="isAddedStamp(5) && 'is-added'"
            >
              <font-awesome-icon
                icon="meh-rolling-eyes"
                @click="handleAddStamp(5)"
              />
              <span>{{ stamp.thinking }}</span>
            </div>
          </div>
          <h3 class="section-title">コメント</h3>
          <ul class="comment-archive" v-if="comment.length > 0">
            <li
              class="comment-archive__item"
              v-for="(commentDetail, index) in comment"
              :key="index"
            >
              <div class="comment-archive__item-header">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
              </div>
              <div class="comment-archive__item-content">
                <p>{{ commentDetail }}</p>
              </div>
            </li>
          </ul>
          <p class="error" v-else>コメントがありません</p>
          <div class="comment">
            <div class="comment__header">
              <div class="comment__avatar">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
              </div>
            </div>
            <div class="comment__content">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="コメント内容"
                v-model="fields.comment"
              >
              </el-input>
              <div class="comment__buttons">
                <el-button
                  class="comment__button"
                  type="primary"
                  @click="handleAddComment"
                  :disabled="!fields.comment || isAddingComment"
                  >投稿する</el-button
                >
              </div>
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

const client = createClient();

Vue.use(Skeleton);

export default {
  name: "Article",
  metaInfo() {
    return {
      title: this.article && this.article.fields && this.article.fields.title
    };
  },
  data() {
    return {
      id: this.$route.params.id,
      isLoading: true,
      article: undefined,
      rate: 0,
      rateCount: 0,
      comment: [],
      stamp: {
        smile: 0,
        crying: 0,
        anger: 0,
        surprise: 0,
        thinking: 0
      },
      fields: {
        rate: 0,
        comment: ""
      },
      isAddingRate: false,
      isAddingComment: false,
      isAddingStamp: false,
      get isAddedRate() {
        let addedRateArticles =
          JSON.parse(localStorage.getItem("addedRateArticles")) || [];
        return addedRateArticles.find(id => id === this.id);
      },
      get addedStamp() {
        let addedStampArticles =
          JSON.parse(localStorage.getItem("addedStampArticles")) || {};
        return (
          Object.entries(addedStampArticles).find(([key]) => key === this.id) &&
          Object.entries(addedStampArticles).find(([key]) => key === this.id)[1]
        );
      }
    };
  },
  methods: {
    handleOnLinkClick() {
      window.open(this.article.fields.original, "_blank");
    },
    time(time) {
      return dayjs(time).format("YYYY/MM/DD");
    },
    isArticle(article) {
      return article.title === this.id && article.title === this.id;
    },
    getArticle() {
      return client.getEntry(this.id);
    },
    async handleAddRate() {
      this.isAddingRate = true;
      try {
        const rateRes = await fetch(
          `${process.env.VUE_APP_API_URL}/rates?newsID=${this.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ rate: this.fields.rate })
          }
        );
        if (!rateRes.ok) {
          throw Error(rateRes.statusText);
        }
        let addedRateArticles =
          JSON.parse(localStorage.getItem("addedRateArticles")) || [];
        addedRateArticles = [...addedRateArticles, this.id];
        localStorage.setItem(
          "addedRateArticles",
          JSON.stringify(addedRateArticles)
        );
        this.$message({
          message: "評価しました!!",
          type: "success"
        });
        this.fetchRate();
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
      this.isAddingRate = false;
    },
    async handleAddComment() {
      this.isAddingComment = true;
      try {
        const commentRes = await fetch(
          `${process.env.VUE_APP_API_URL}/comments?newsID=${this.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment: this.fields.comment })
          }
        );
        if (!commentRes.ok) {
          throw Error(commentRes.statusText);
        }
        this.fields.comment = "";
        this.$message({
          message: "コメントを追加しました!!",
          type: "success"
        });
        this.fetchComment();
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
      this.isAddingComment = false;
    },
    async handleAddStamp(stampID) {
      this.isAddingStamp = true;
      try {
        const stampRes = await fetch(
          `${process.env.VUE_APP_API_URL}/emotions?newsID=${this.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              emotion: stampID
            })
          }
        );
        if (!stampRes.ok) {
          throw Error(stampRes.statusText);
        }
        let addedStampArticles =
          JSON.parse(localStorage.getItem("addedStampArticles")) || {};
        addedStampArticles = { ...addedStampArticles, [this.id]: stampID };
        localStorage.setItem(
          "addedStampArticles",
          JSON.stringify(addedStampArticles)
        );
        this.$message({
          message: "スタンプを投稿しました!!",
          type: "success"
        });
        this.fetchStamp();
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
      this.isAddingStamp = false;
    },
    fetchRate() {
      return fetch(`${process.env.VUE_APP_API_URL}/rates?newsID=${this.id}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          this.rate = Math.round(Number(data.mean) * 100) / 100;
          this.rateCount = data.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchComment() {
      return fetch(`${process.env.VUE_APP_API_URL}/comments?newsID=${this.id}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          this.comment = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchStamp() {
      return fetch(`${process.env.VUE_APP_API_URL}/emotions?newsID=${this.id}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          this.stamp = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    isAddedStamp(stampID) {
      return this.addedStamp === stampID;
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
    this.fetchRate();
    this.fetchComment();
    this.fetchStamp();
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
    display: flex;

    @media screen and (max-width: 767px) {
      display: block;
    }

    &-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &-footer {
      margin-left: 2rem;
      padding-left: 2rem;
      border-left: 1px solid #e6e6e6;

      @media screen and (max-width: 767px) {
        margin-top: 2rem;
        padding-top: 3.2rem;
        margin-left: 0;
        padding-left: 0;
        border-top: 1px solid #e6e6e6;
        border-left: none;
      }
    }
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

  &__links {
    text-align: center;
  }

  &__link {
    font-size: 1.8rem;
    letter-spacing: 0.1em;
    padding: 2.2rem;
    font-weight: bold;
    width: 100%;
    max-width: 40rem;

    @media screen and (max-width: 767px) {
      padding: 2rem;
    }
  }

  &__rate {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    &-num {
      font-size: 4rem;
      font-weight: 600;
      font-family: "游明朝体", "Yu Mincho", YuMincho, "ヒラギノ明朝 Pro",
        "Hiragino Mincho Pro", "MS P明朝", "MS PMincho", serif;
      margin: 0 0 1rem;
    }

    &-text {
      color: #949494;
      font-size: 1.3rem;
      margin: 0.4rem;
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

  &__footer {
    margin-top: 5rem;
  }
}

.rate {
  background: #f7f7f7;
  padding: 2.8rem;
  border-radius: 0.4rem;
  position: relative;
  overflow: hidden;

  &.is-added {
    pointer-events: none;

    &::after {
      content: "この記事は既に評価されています";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 100;
      pointer-events: none;
      background: #e4b97388;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3.2rem;
      font-weight: bold;
      letter-spacing: 0.1em;
      color: #fff;
      padding: 2.8rem;
      box-sizing: border-box;

      @media screen and (max-width: 767px) {
        font-size: 2.4rem;
      }
    }
  }

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

.section-title {
  margin: 4rem 0 2rem;
}

.comment-archive {
  list-style: none;
  padding: 0;

  &__item {
    display: flex;

    &-header {
      margin-right: 2.4rem;
    }

    &-content {
      flex: 1;
      padding-bottom: 2rem;
      border-bottom: 1px solid #dfdfdf;

      p {
        margin: 0;
        color: #5c5c5c;
        line-height: 1.65;
      }
    }
  }
}

.comment {
  margin-top: 2.8rem;
  display: flex;

  &__header {
    margin-right: 2.4rem;
  }

  &__content {
    flex: 1;
  }

  &__buttons {
    margin-top: 2rem;
  }

  &__button {
    -webkit-appearance: none;
  }
}

.stamp {
  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 4rem -1.2rem 2.4rem;

    @media screen and (max-width: 767px) {
      margin: 4rem -1rem -1rem;
    }

    &.is-disabled {
      pointer-events: none;
    }
  }

  font-size: 5.4rem;
  padding: 1.2rem;
  color: #d0d0d0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 767px) {
    font-size: 4rem;
    padding: 1rem;
  }

  span {
    font-size: 0.4em;
    margin-top: 0.2em;
  }

  &:hover,
  &.is-selected,
  &.is-added {
    &.is-smile {
      color: #ffd251;
    }
    &.is-sad {
      color: #4edae1;
    }
    &.is-angry {
      color: #ff6b73;
    }
    &.is-surprise {
      color: #9bdb35;
    }
    &.is-thinking {
      color: #8a97ff;
    }
  }
}

.error {
  color: #b5b5b5;
}
</style>

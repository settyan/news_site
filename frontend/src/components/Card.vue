<template>
  <div class="card">
    <router-link :to="`/post/${id}`" class="card__link">
      <el-card :body-style="{ padding: '0px' }">
        <div class="card__imgbox" v-if="eyecatch">
          <el-image
            class="card__img"
            :src="eyecatch"
            fit="cover"
            lazy
          ></el-image>
        </div>
        <div class="card__inner">
          <h2 class="card__title" v-if="title">{{ title }}</h2>
          <div class="card__meta">
            <p class="card__date" v-if="date">
              <i class="el-icon-date"></i><span>{{ time(date) }}</span>
            </p>
            <p class="card__author" v-if="author">
              By.<span>{{ author }}</span>
            </p>
            <p class="card__media" v-if="media">
              <span>{{ media }}</span>
            </p>
          </div>
          <p class="card__excerpt" v-if="excerpt">
            {{ excerpt }}
          </p>
          <div class="card__rate">
            <el-rate :value="rate" disabled />
            <p>{{ rateCount }}票の評価</p>
          </div>
        </div>
      </el-card>
    </router-link>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "Card",
  props: {
    id: String,
    eyecatch: String,
    title: String,
    date: String,
    author: String,
    media: String,
    excerpt: String
  },
  data() {
    return {
      rate: 0,
      rateCount: 0
    };
  },
  methods: {
    time: function(time) {
      return dayjs(time).format("YYYY/MM/DD");
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
          this.rate = Number(data.mean);
          this.rateCount = data.count;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.fetchRate();
  }
};
</script>

<style lang="scss" scoped>
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

  &__excerpt {
    color: #a5a5a5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1rem 0 0;
  }
}
</style>

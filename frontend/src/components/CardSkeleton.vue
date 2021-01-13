<template>
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
</template>

<script>
import Vue from "vue";
import Skeleton from "vue-loading-skeleton";

Vue.use(Skeleton);

export default {
  name: "CardSkeleton"
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

<template>
  <div class="root">
    <h1>{{ id }}</h1>
  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    return {
      id: this.$route.params.id
    };
  },
  metaInfo() {
    return {
      title: this.id
    };
  }
};
</script>

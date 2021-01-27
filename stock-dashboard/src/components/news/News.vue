<template>
  <div class="container w-full mx-auto pt-3">
    <div class="flex flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-4 2xl:row-span-2 2xl:pb-8 ml-2 pt-4 px-6">
      <article-card v-for="card in newsList" :key="card.cardStyle" :class="card.cardStyle"
                      v-bind:propItem="card.cardType"
                      v-bind:propTitle="card.title"
                      v-bind:propMain="card.main"></article-card>

    </div>
  </div>
</template>

<script>
import ArticleCard from "@/components/news/ArticleCard.vue";

export default {
  name: "News",
  components: {
    "article-card": ArticleCard
  },
  data() {
    return {
      newsList: [],
      order: 1,
      cardTypeClass: [
        "bg-indigo-600 lg:row-span-1 2xl:row-span-1 lg:col-span-2 rounded-lg shadow-xl mb-2 lg:mb-0",
        "bg-gray-900 lg:row-span-1 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl mb-2 lg:mb-0",
        "bg-blue-800 lg:row-span-3 lg:col-span-1 rounded-lg shadow-xl mb-2 lg:pb-0 2xl:h-screen",
        "bg-red-800 lg:row-span-2 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl mb-2 lg:mb-0",
        "bg-purple-800 lg:row-span-2 2xl:row-span-1 col-span-2 rounded-lg shadow-xl mb-2 lg:mb-0"
      ]
    }
  },
  created() {
    this.newsList = [];
    let test = [];

    let news = Math.floor(Math.random() * 40);
    for (let i = 0; i < news; i++) {
      test.push({
        title: Math.floor(Math.random() * 16777215).toString(16),
        main: Math.floor(Math.random() * 16777215).toString(16)
      })
    }

    for (let i = 1; i <= test.length; i++) {
      let cardType = (i % 5) === 0 ? 5 : (i % 5);
      let article = test[i-1];
      this.newsList.push({
        title: article.title,
        main: article.main,
        cardType: cardType,
        cardStyle: this.cardTypeClass[cardType - 1] + " lg:order-" + i
      });
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>

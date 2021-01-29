<template>
  <div class="container w-full mx-auto pt-3">
    <div class="flex flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-4 2xl:row-span-2 2xl:pb-8 ml-2 pt-4 px-6">
      <article-card v-for="card in sortList(newsList)" :key="card.index" :class="card.cardStyle"
                      v-bind:propOrigin="card.origin"
                      v-bind:propCategory="card.category"
                      v-bind:propLink="card.href"
                      v-bind:propItem="card.cardType"
                      v-bind:propTitle="card.title"
                      v-bind:propMain="card.main"></article-card>

    </div>
  </div>
</template>

<script>
import ArticleCard from "@/components/news/ArticleCard.vue";
import axios from "axios";

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
        "bg-indigo-600 lg:row-span-1 2xl:row-span-1 lg:col-span-2 rounded-lg shadow-xl lg:mb-0",
        "bg-gray-900 lg:row-span-1 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl lg:mb-0",
        "bg-blue-800 lg:row-span-3 lg:col-span-1 rounded-lg shadow-xl lg:pb-0 2xl:h-screen",
        "bg-red-800 lg:row-span-2 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl lg:mb-0",
        "bg-purple-800 lg:row-span-2 2xl:row-span-1 col-span-2 rounded-lg shadow-xl lg:mb-0"
      ]
    }
  },
  created() {
    this.newsList = [];
    let url = "/";
    if (process.env.NODE_ENV === "development") {
      url = "http://localhost:9090/news";
    }
    axios.get(url).then((resp) => {
      let newsList = resp.data;
      this.createNewsModelList(newsList);
    }).catch((err) => {
      console.log(err);
    });
  },
  mounted() {
  },
  methods: {
    createNewsModelList(unmappedNewsList) {
      for (let i = 1; i <= unmappedNewsList.length; i++) {
        let cardType = (i % 5) === 0 ? 5 : (i % 5);
        let article = unmappedNewsList[i-1];
        this.newsList.push({
          index: i - 1,
          title: article.title,
          category: article.category,
          href: article.href,
          origin: article.origin,
          main: article.main + "...",
          cardType: cardType,
          cardStyle: this.cardTypeClass[cardType - 1] + " lg:order-" + i
        });
      }
    },
    sortList(list) {
      return list.sort((valA, valB) => { return valB.index - valA.index});
    }
  }
}
</script>

<style scoped>

</style>

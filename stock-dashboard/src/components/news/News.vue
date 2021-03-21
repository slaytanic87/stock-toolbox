<template>
  <div class="container w-full mx-auto pt-20">
    <loading-page v-if="newsListModel.length === 0"></loading-page>
    <div class="flex flex-col lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-4 2xl:row-span-2 2xl:pb-8 ml-2 pt-4 px-6">
      <article-card v-for="card in newsListModel" :key="card.index" :class="card.cardStyle"
                    v-bind:propOrigin="card.origin"
                    v-bind:propCategory="card.category"
                    v-bind:propLink="card.href"
                    v-bind:propItem="card.cardType"
                    v-bind:propTitle="card.title"
                    v-bind:propMain="card.main"
                    v-bind:propImage="card.image"></article-card>

    </div>
    <div class="flex flex-col items-center my-12">
      <div class="flex text-gray-200">
        <div @click="switchPage(-1)" class="h-12 w-12 mr-1 flex justify-center items-center rounded-full bg-blue-700 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left w-6 h-6">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
        <div class="flex h-12 font-medium rounded-full bg-gray-700">
          <div @click="setNewsChunk(p - 1)"
               class="w-12 md:flex justify-center items-center hidden cursor-pointer leading-5 transition duration-150 ease-in rounded-full"
               v-for="p in pages" :key="p">
            <div v-if="(p - 1) === currentPage" class="text-red-500">{{p}}</div>
            <div v-else>{{p}}</div>
          </div>
        </div>
        <div @click="switchPage(1)" class="h-12 w-12 ml-1 flex justify-center items-center rounded-full bg-blue-700 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right w-6 h-6">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCard from "@/components/news/ArticleCard.vue";
import LoadingPage from "@/components/LoadingPage";
import axios from "axios";

export default {
  name: "News",
  components: {
    "article-card": ArticleCard,
    "loading-page": LoadingPage
  },
  data() {
    return {
      newsListModel: [],
      partitions: [],
      pages: 1,
      currentPage: 0,
      order: 1,
      cardTypeClass: [
        "bg-indigo-600 lg:hover:bg-pink-700 lg:row-span-1 2xl:row-span-1 lg:col-span-2 rounded-lg shadow-xl lg:mb-0",
        "bg-gray-900 lg:hover:bg-pink-700 lg:row-span-1 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl lg:mb-0",
        "bg-blue-800 lg:hover:bg-pink-700 lg:row-span-2 2xl:row-span-2 lg:col-span-1 rounded-lg shadow-xl lg:pb-0 2xl:h-screen",
        "bg-red-800 lg:hover:bg-pink-700 lg:row-span-1 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl lg:mb-0",
        "bg-purple-800 lg:hover:bg-pink-700 lg:row-span-1 2xl:row-span-1 col-span-2 rounded-lg shadow-xl lg:mb-0"
      ]
    }
  },
  created() {
    this.fetchNews();
  },
  mounted() {
  },
  methods: {
    async fetchNews() {
      this.newsListModel = [];
      let url = "/";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/news";
      }
      axios.get(url).then((resp) => {
        let newsList = resp.data;
        const spaces = 10;
        let mapped = this.createNewsModelList(newsList);
        this.partitions = this.createPartition(mapped, spaces);
        this.pages = this.partitions.length;
        this.setNewsChunk(0);
      }).catch((err) => {
        console.log(err);
      });
    },
    createPartition(list, spaces) {
      let output = [];
      for (let i = 0; i < list.length; i += spaces) {
        output[output.length] = list.slice(i, i + spaces);
      }
      return output;
    },
    createNewsModelList(unmappedNewsList) {
      let news = [];
      for (let i = 1; i <= unmappedNewsList.length; i++) {
        let cardType = (i % 5) === 0 ? 5 : (i % 5);
        let article = unmappedNewsList[i-1];
        news.push({
          index: i - 1,
          title: article.title,
          category: article.category,
          href: article.href,
          origin: article.origin,
          image: article.image,
          main: article.main + "...",
          cardType: cardType,
          cardStyle: this.cardTypeClass[cardType - 1] + " lg:order-" + i
        });
      }
      return news;
    },
    setNewsChunk(index) {
      this.currentPage = index;
      this.newsListModel = this.partitions[index];
    },
    switchPage(amount) {
      let nextPage = amount + this.currentPage;
      if (nextPage < 0 || nextPage >= this.pages) {
        return;
      }
      this.setNewsChunk(nextPage);
    }
  }
}
</script>

<style scoped>

</style>

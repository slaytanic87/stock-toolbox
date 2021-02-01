<template>
  <div>
    <div v-if="propItem === 1" class="mx-6 my-8 2xl:mx-10">
      <img class="w-8 md:w-9 lg:w-10 2xl:w-20 h-8 md:h-9 lg:h-10 2xl:h-20 rounded-full border-2 ml-1 lg:ml-3 2xl:ml-0 md:-mt-1 2xl:-mt-4" src="../../assets/news.jpg" />
      <h1 class="text-white text-xs md:text-base pl-12 lg:pl-16 2xl:pl-20 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-20 2xl:mx-8">{{propOrigin}}</h1>
      <h2 class="text-white text-opacity-50 text-xs md:text-base pl-12 lg:pl-16 2xl:pl-20 2xl:my-2 2xl:mx-8">{{propCategory}}</h2>
    </div>
    <div v-if="propItem === 1" class="-mt-6 relative">
      <p class="text-white px-7 lg:px-9 2xl:pt-6 2xl:mx-2">
        {{propTitle}}
      </p>
      <br/>
      <p class="text-white text-opacity-50 font-medium md:text-sm px-7 lg:px-9 mb-3 2xl:pb-8 2xl:mx-2">
        “ {{propMain}} ”
      </p>
      <div class="mb-3">
        <a v-if="propLink" :href="propLink" class="no-underline hover:underline 2xl:pb-8 2xl:mx-9">Link</a>
      </div>
    </div>

    <div v-if="propItem === 2" class="mx-8 2xl:mx-10 my-10">
      <img class="w-8 md:w-9 2xl:w-20 h-8 md:h-9 2xl:h-20 rounded-full border-2 -ml-1 -mt-2 lg:-mt-4" src="../../assets/news.jpg" />
      <h1 class="text-white text-xs md:text-base pl-11 md:pl-12 2xl:pl-24 -mt-8 md:-mt-10 2xl:-mt-16">{{propOrigin}}</h1>
      <h2 class="text-white text-xs md:text-base text-opacity-50 pl-11 md:pl-12 2xl:pl-24">{{propCategory}}</h2>
    </div>
    <div v-if="propItem === 2" class="-mt-8 mx-1 lg:mx-2">
      <p class="text-white 2xl:pt-4 px-7 2xl:px-8 lg:pl-5 lg:pr-8">
        {{propTitle}}
      </p>
      <br />
      <p class="text-white text-opacity-50 font-medium md:text-sm pl-6 lg:pl-5 pr-4 -mt-1 lg:mt-6 2xl:mt-2 2xl:px-8">
        “ {{propMain}} ”
      </p>
      <div class="mb-3 mt-3">
        <a v-if="propLink" :href="propLink" class="no-underline hover:underline pl-3  2xl:mx-5">Link</a>
      </div>
    </div>

    <div v-if="propItem === 3" class="mx-8 my-10 lg:pl-4">
        <img class="w-8 md:w-9 lg:w-12 2xl:w-20 h-8 md:h-9 lg:h-12 2xl:h-20 rounded-full border-2 lg:-mt-4 -ml-1 lg:-ml-4" src="../../assets/news.jpg" />
        <h1 class="primary-color-blackish-blue text-xs md:text-base pl-10 md:pl-12 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-12 2xl:-mt-16">{{propOrigin}}</h1>
        <h2 class="primary-color-blackish-blue-opacity text-xs md:text-base pl-10 md:pl-12 2xl:pl-24">{{propCategory}}</h2>
    </div>
    <div v-if="propItem === 3" class="px-3 lg:px-5 lg:-mt-4 mb-5 lg:mb-0">
      <p class="primary-color-blackish-blue 2xl:pt-2 px-4 lg:px-3 -mt-2 lg:-mt-0">
          {{propTitle}}
      </p>
      <br />
      <p class="primary-color-blackish-blue-opacity font-medium md:text-sm px-4 lg:px-0 2xl:px-4 lg:pr-3 mt-2 lg:-mt-1 2xl:mt-2 2xl:pb-3">
          “ {{propMain}} ”
      </p>
      <div class="mt-3">
        <a v-if="propLink" :href="propLink" class="no-underline hover:underline 2xl:px-3 mb-3 2xl:pb-8">Link</a>
      </div>
    </div>

    <div v-if="propItem === 4" class="mx-8 my-10 lg:my-8">
      <img class="w-8 md:w-9 lg:w-11 2xl:w-20 h-8 md:h-9 lg:h-11 2xl:h-20 rounded-full border-2 -mt-3 -ml-1 lg:-ml-0" src="../../assets/news.jpg" />
      <h1 class="primary-color-blackish-blue text-xs md:text-base pl-11 md:pl-12 lg:pl-14 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-16">{{propOrigin}}</h1>
      <h2 class="primary-color-blackish-blue-opacity text-xs md:text-base pl-11 md:pl-12 lg:pl-14 2xl:pl-24">{{propCategory}}</h2>
    </div>
    <div v-if="propItem === 4" class="-mt-4 ml-5 mr-11">
      <p class="primary-color-blackish-blue px-2 lg:px-3 -mt-6 lg:-mt-5 2xl:mt-10 2xl:pb-2">
        {{propTitle}}
      </p>
      <br />
      <p class="primary-color-blackish-blue-opacity font-medium md:text-sm pl-2 lg:pl-3 lg:pr-4 mb-3 2xl:pt-2 -mt-3">
        “ {{propMain}} ”
      </p>
      <div class="mb-3">
      <a v-if="propLink" :href="propLink" class="no-underline hover:underline mb-2 2xl:pb-8 2xl:mx-3">Link</a>
      </div>
    </div>

    <div v-if="propItem === 5" class="mx-8 my-8">
      <img class="w-8 md:w-9 lg:w-10 2xl:w-20 h-8 md:h-9 lg:h-10 2xl:h-20 rounded-full border-2 lg:-mt-3" src="../../assets/news.jpg" />
      <h1 class="text-white text-xs md:text-base pl-12 md:pl-14 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-16">{{propOrigin}}</h1>
      <h2 class="text-white text-xs md:text-base text-opacity-50 pl-12 md:pl-14 2xl:pl-24">{{propCategory}}</h2>
    </div>
    <div v-if="propItem === 5" class="px-3 -mt-3 mb-5 lg:mb-0">
      <p class="text-white text-lg px-4 -mt-3 lg:-mt-6 2xl:mt-8">
        {{propTitle}}
      </p>
      <br />
      <p class="text-white text-opacity-50 font-medium md:text-sm px-4 mt-3 lg:-mt-3">
        “ {{propMain}} ”
      </p>
      <div class="mb-4 mt-3">
        <a v-if="propLink" :href="propLink" class="no-underline hover:underline mb-3 2xl:pb-8 2xl:mx-4">Link</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleCard.vue",
  props: {
    propOrigin: {
      required: true
    },
    propCategory: {
      required: true,
      default: "News"
    },
    propTitle: {
      required: true
    },
    propMain: {
      required: true
    },
    propItem: {
      required: true,
      default: 1
    },
    propLink: {
      required: false,
      default: ""
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>

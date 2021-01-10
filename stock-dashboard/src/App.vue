<template>
  <div id="app">
    <div class="p-8 bg-gray-900 flex justify-center w-screen h-screen">
       <div class="px-5 py-4 bg-gray-800 shadow rounded-xl"> 
         
        <div class="flex mb-4 justify-center">
            <div class="ml-2 mt-0.5">
              <span class="block font-medium text-base leading-snug text-white text-xl">Watchlist</span>
            </div>
        </div>

        <Watchlist/>
       </div>
    </div>
  </div>
</template>

<script>
import Watchlist from "./components/Watchlist.vue"
export default {
  name: 'App',
  components: {
    Watchlist
  },
  created () {
  }
}
</script>

<style lang="scss">
</style>

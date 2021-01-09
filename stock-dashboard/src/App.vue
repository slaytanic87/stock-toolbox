<template>
  <div id="app" class="dark:bg-black dark:bg-gray-900 dark:text-purple-50">
      <Watchlist/>
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

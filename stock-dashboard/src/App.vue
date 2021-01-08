<template>
  <div id="app">
    <md-card>
      <md-card-content>
        <Watchlist/>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import Watchlist from "./components/Watchlist.vue"
export default {
  name: 'App',
  components: {
    Watchlist
  }
}
</script>

<style lang="scss">
</style>

<template>
  <div
      class="k-line-chart-container">
    <h3
        class="k-line-chart-title">{{title}}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    title: String
  }
}
</script>

<style scoped>
.k-line-chart-title {
  margin: 0;
  color: #ececec;
  padding-bottom: 5px;
}

.k-line-chart-container {
  display: flex;
  flex-direction: column;
  margin: 15px;
  border-radius: 2px;
  width: 1100px;
  height: 650px;
  padding: 16px 6px 16px 16px;
}
</style>

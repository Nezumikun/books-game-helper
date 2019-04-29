<template>
  <div id="app">
    <TopNavBar />
    <router-view/>
  </div>
</template>

<script>
import TopNavBar from '@/components/TopNavBar.vue'

export default {
  components: {
    TopNavBar
  }
}
</script>

<style lang="scss">
</style>

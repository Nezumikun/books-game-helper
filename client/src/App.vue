<template>
  <div id="app">
    <v-app id="inspire">
      <TopNavBar />
      <router-view/>
    </v-app>
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

<template>
  <div id="app"
    @alert-show='show'
  >
    <v-app id="inspire">
      <TopNavBar />
      <router-view/>
      <Alert
      />
    </v-app>
  </div>
</template>

<script>
import TopNavBar from '@/components/TopNavBar.vue'
import Alert from '@/components/Alert.vue'

export default {
  components: {
    TopNavBar, Alert
  },
  methods: {
    show: function (data) {
      console.log('show', data)
    }
  }
}
</script>

<style lang="scss">
</style>

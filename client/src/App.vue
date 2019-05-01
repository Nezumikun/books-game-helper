<template>
  <div id="app"
  >
    <v-app id="inspire">
      <TopNavBar />
      <router-view
        @alert-show='show'
      />
      <Alert ref="alert"/>
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
      this.$refs.alert.show(data)
    }
  },
  created () {
    this.$nextTick(function () {
      this.$refs.alert.show({ text: 'Test!' })
    })
  }
}
</script>

<style lang="scss">
</style>

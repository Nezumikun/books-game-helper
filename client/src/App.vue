<template lang="pug">
  div(id="app")
    v-app(id="inspire")
      TopNavBar
      LeftMenu
      router-view(
        @alert-show='show'
      )
      Alert(ref="alert")
</template>

<script>
import TopNavBar from '@/components/TopNavBar.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import Alert from '@/components/Alert.vue'

export default {
  components: {
    TopNavBar, LeftMenu, Alert
  },
  methods: {
    show: function (data) {
      this.$refs.alert.show(data)
    }
  }
}
</script>

<style lang="scss">
</style>

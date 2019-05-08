<template>
  <v-content>
    <v-container fluid>
      <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </v-container>
  </v-content>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  created () {
    this.$router.push(this.$store.state.auth.user.canCreateUsers ? '/users' : '/games')
  }
}
</script>

<template lang="pug">
  v-content
    v-container fluid
</template>

<script>
export default {
  name: 'home',
  created () {
    this.$router.push(this.$store.state.auth.user.canCreateUsers ? '/users' : '/games')
  }
}
</script>

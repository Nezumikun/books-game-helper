<template lang="pug">
  div
</template>

<script>
import { AUTH_LOGOUT } from '../store/actions/auth'

export default {
  name: 'logout',
  created () {
    this.$store.dispatch(AUTH_LOGOUT)
      .then(() => {
        this.$router.push('/login')
      })
  }
}
</script>

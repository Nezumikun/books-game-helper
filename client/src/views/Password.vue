<template lang="pug">
  v-content
    v-container(fluid)
      h1 Смена пароля пользователя {{ login }}
      v-divider(class="mt-3")
      v-subheader {{ description }}
</template>

<script>
export default {
  name: 'password',
  data () {
    return {
      login: this.$store.state.auth.user.login,
      description: this.$store.state.auth.user.description
    }
  }
}
</script>

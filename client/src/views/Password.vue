<template lang="pug">
  v-content
    v-container(fluid)
      v-layout(justify-center)
        v-flex(xs12 sm10 md8 lg6)
          v-card(ref="form")
            v-toolbar(dark color="primary")
              v-toolbar-title Смена пароля текущего пользователя
            v-card-text
              v-form
              v-text-field(v-model="currentPassword" :rules="nameRules" label="Действующий пароль" required autofocus :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'" :type="showCurrentPassword ? 'text' : 'password'" @click:append="showCurrentPassword = !showCurrentPassword")
</template>

<script>
export default {
  name: 'password',
  data () {
    return {
      currentPassword: '',
      showCurrentPassword: false
    }
  }
}
</script>

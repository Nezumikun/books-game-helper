<template lang="pug">
  v-content
    v-container(fluid)
      v-layout(justify-center)
        v-flex(xs12 sm12 md8 lg4)
          v-form(v-model="valid" @submit.prevent="changePassword" lazy-validation ref="form")
            v-card
              v-toolbar(dark color="primary")
                v-toolbar-title Смена пароля текущего пользователя
              v-card-text
                h3 Старый пароль
                v-text-field(
                  v-model="currentPassword"
                  :rules="rulesCurrentPassword"
                  label="Действующий пароль"
                  required
                  autofocus
                  :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  @click:append="showCurrentPassword = !showCurrentPad"
                )
                v-divider
                h3(class="mt-3") Новый пароль
                v-text-field(
                  v-model="newPassword"
                  :rules="rulesNewPassword"
                  label="Новый пароль"
                  required
                  :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                  :type="showNewPassword ? 'text' : 'password'"
                  @click:append="showNewPassword = !showNewPassword"
                  ref="newPassword"
                )
                v-text-field(
                  v-model="repeatPassword"
                  :rules="rulesRepeatPassword"
                  label="Повторный ввод нового пароля"
                  required
                  :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                  :type="showRepeatPassword ? 'text' : 'password'"
                  @click:append="showRepeatPassword = !showRepeatPassword"
                  ref="fieldRepeatPassword"
                )
              v-card-actions
                v-spacer
                v-btn(color="success" depressed :disabled="!valid" type="submit") Сменить
</template>

<script>
import apiCall from '../tools/api'
import hash from 'hash.js'
import { AUTH_LOGOUT } from '../store/actions/auth'

export default {
  name: 'password',
  data () {
    return {
      valid: true,
      currentPassword: '',
      showCurrentPassword: false,
      rulesCurrentPassword: [
        v => !!v || 'Поле должно быть заполнено'
      ],
      newPassword: '',
      showNewPassword: false,
      rulesNewPassword: [
        v => !!v || 'Поле должно быть заполнено',
        v => (v !== this.currentPassword) || 'Новый пароль должен отличаться от старого'
      ],
      repeatPassword: '',
      showRepeatPassword: false,
      rulesRepeatPassword: [
        v => !!v || 'Поле должно быть заполнено',
        v => (this.repeatPassword === this.newPassword) || 'Повторный ввод пароля отличается'
      ]
    }
  },
  methods: {
    changePassword () {
      if (this.$refs.form.validate()) {
        apiCall('/user/password', 'POST', {
          token: this.$store.state.auth.token,
          oldPasswordHash: hash.sha256().update(this.currentPassword).digest('hex'),
          newPasswordHash: hash.sha256().update(this.newPassword).digest('hex')
        })
          .then(() => {
            this.$emit('alert-show', {
              text: `Пароль успешно изменён!`,
              color: 'success'
            })
            this.$refs.form.reset()
          })
          .catch((err) => {
            this.$emit('alert-show', {
              text: (err.data) ? `Ошибка ${err.status}: ${err.data.message}!` : `Ошибка: ${err.message}!`,
              color: 'error'
            })
            if (err.response) {
              console.log(err.response)
              if (err.response.status === 401) {
                this.$store.dispatch(AUTH_LOGOUT)
                  .then(() => {
                    this.$router.push('/login')
                  })
              }
            }
          })
      }
    }
  }
}
</script>

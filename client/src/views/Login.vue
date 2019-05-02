<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form @submit.prevent="login">
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Авторизация</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-text-field prepend-icon="person" name="login" label="Имя пользователя" type="text" v-model="username" autofocus></v-text-field>
                <v-text-field prepend-icon="lock" name="password" label="Пароль" id="password" type="password" v-model="password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Войти</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { AUTH_REQUEST } from '../store/actions/auth'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  name: 'login',
  methods: {
    login: function () {
      if ((this.username === '') || (this.password === '')) {
        return false
      }
      this.$store.dispatch(AUTH_REQUEST, { username: this.username, password: this.password })
        .then(() => {
          this.$emit('alert-show', {
            text: `Добро пожаловать, ${this.$store.state.auth.user.description}!`,
            color: 'success'
          })
          this.$router.push('/')
        })
        .catch((err) => {
          console.log(err)
          this.$emit('alert-show', {
            text: `Ошибка ${err.status}: ${err.data.message}!`,
            color: 'error'
          })
        })
      return false
    }
  },
  components: {
  }
}
</script>

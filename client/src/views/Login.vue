<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Авторизация</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit="login">
                <v-text-field prepend-icon="person" name="login" label="Имя пользователя" type="text" v-model="username"></v-text-field>
                <v-text-field prepend-icon="lock" name="password" label="Пароль" id="password" type="password" v-model="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Войти</v-btn>
            </v-card-actions>
          </v-card>
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
      console.log(this)
      if ((this.username === '') || (this.password === '')) {
        return
      }
      this.$store.dispatch(AUTH_REQUEST, { username: this.username, password: this.password }).then(() => {
        this.$router.push('/')
      })
    }
  },
  components: {
  }
}
</script>

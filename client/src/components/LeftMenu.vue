<template lang="pug">
  v-navigation-drawer(
    v-model="drawer"
    v-if="this.$store.getters.isAuthenticated"
    app
    clipped
    absolute
    overflow
  )
    v-list(dense)
      v-list-tile(v-for="item in menu_items" :key="item.route" @click="close" :to="'/' + item.route")
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.title }}
</template>

<script>
import * as view from '../store/actions/view'

export default {
  data () {
    return {
    }
  },
  computed: {
    drawer: {
      get: function () {
        return this.$store.getters.isLeftMenuVisible
      },
      set: function (val) {
        this.$store.dispatch(val ? view.SHOW_LEFT_MENU : view.HIDE_LEFT_MENU)
      }
    },
    menu_items () {
      let menu = []
      if (this.$store.state.auth.user.canCreateUsers) {
        menu.push({
          icon: 'people',
          route: 'users',
          title: 'Пользователи'
        })
      }
      if (this.$store.state.auth.user.canCreateGames) {
        menu.push({
          icon: 'casino',
          route: 'games',
          title: 'Игры'
        })
      }
      menu.push({
        icon: 'fingerprint',
        route: 'password',
        title: 'Сменить пароль'
      })
      menu.push({
        icon: 'exit_to_app',
        route: 'logout',
        title: 'Выход'
      })
      return menu
    }
  },
  methods: {
    close () {
      // this.drawer = false
    }
  }
}
</script>

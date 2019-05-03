<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      v-if="this.$store.getters.isAuthenticated"
      app
      clipped
      absolute
      overflow
    >
      <v-list dense>
        <v-list-tile v-for="item in menu_items" :key="item.route" @click="close" :to="'/' + item.route">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar clipped-left color="indigo" dark app absolute>
      <v-toolbar-side-icon
        v-if="this.$store.getters.isAuthenticated"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>Книгоигры</v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      menu_items: [
        {
          icon: 'home',
          route: 'home',
          title: 'Начало'
        },
        {
          icon: 'people',
          route: 'users',
          title: 'Пользователи'
        },
        {
          icon: 'casino',
          route: 'games',
          title: 'Игры'
        },
        {
          icon: 'fingerprint',
          route: 'password',
          title: 'Сменить пароль'
        },
        {
          icon: 'exit_to_app',
          route: 'logout',
          title: 'Выход'
        }
      ]
    }
  },
  methods: {
    close () {
      // this.drawer = false
    }
  }
}
</script>

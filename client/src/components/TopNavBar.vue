<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      absolute
      overflow
    >
      <v-list dense>
        <v-list-tile @click="close" to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="close" to="/logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Выход</v-list-tile-title>
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
      drawer: false
    }
  },
  methods: {
    close () {
      this.drawer = false
    }
  }
}
</script>

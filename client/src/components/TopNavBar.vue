<template lang="pug">
  v-toolbar(
    clipped-left
    color="indigo"
    dark
    app
    absolute
    extended
    extension-height="7"
  )
    v-toolbar-side-icon(
      v-if="this.$store.getters.isAuthenticated"
      @click.stop="toggle"
    )
    v-toolbar-title Книгоигры
    v-progress-linear(
      slot="extension"
      :indeterminate="true"
      class="ma-0"
      color="accent"
      v-show="this.$store.getters.isMainLoaderVisible"
    )
</template>

<script>
import * as view from '../store/actions/view'

export default {
  methods: {
    toggle () {
      this.$store.dispatch(this.$store.getters.isLeftMenuVisible ? view.HIDE_LEFT_MENU : view.SHOW_LEFT_MENU)
    }
  }
}
</script>

<style>
.v-toolbar__extension {
  padding: 0 !important
}
</style>

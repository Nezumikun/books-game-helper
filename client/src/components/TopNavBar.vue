<template lang="pug">
  div(v-show="this.$store.getters.isAuthenticated")
    b-navbar(toggleable="lg" type="dark" variant="secondary" fixed="top")
      b-navbar-brand(to="/") NavBar

      b-navbar-toggle(target="nav-collapse")

      b-collapse(id="nav-collapse" is-nav)
        b-navbar-nav
          b-nav-item(to="/about") About
          b-nav-item(to="/login" v-show="!this.$store.getters.isAuthenticated") Login
          b-nav-item(to="/logout" v-show="this.$store.getters.isAuthenticated") Logout

        // Right aligned nav items
        b-navbar-nav(class="ml-auto")
          b-nav-form
            b-form-input(size="sm" class="mr-sm-2" placeholder="Search")
            b-button(size="sm" class="my-2 my-sm-0" type="submit") Search

          b-nav-item-dropdown(text="Lang" right)
            b-dropdown-item(href="#") EN
            b-dropdown-item(href="#") ES
            b-dropdown-item(href="#") RU
            b-dropdown-item(href="#") FA

          b-nav-item-dropdown(right)
            // Using 'button-content' slot
            template(slot="button-content")
              em User
            b-dropdown-item(href="#") Profile
            b-dropdown-item(href="#") Sign Out
</template>

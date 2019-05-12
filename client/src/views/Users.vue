<template lang="pug">
  v-content
    v-container(fluid)
      v-toolbar(flat color="white")
        v-toolbar-title Пользователи
        v-spacer
      v-divider
      v-data-table(
        :headers="headers"
        :items="users"
        :pagination="pagination"
        :loading="loading"
        class="elevation-1"
        hide-actions
      )
        v-progress-linear(v-slot:progress color="blue" indeterminate)
        template(v-slot:items="line")
          tr
            td {{ line.item.login }}
            td {{ line.item.description }}
            td(align="center")
              v-icon(v-if="line.item.canCreateUsers" color="green" small) check_circle_outline
            td(align="center")
              v-icon(v-if="line.item.canCreateGames" color="green" small) check_circle_outline
            td(align="center")
              v-icon(v-if="line.item.canCreateGames" color="green" small) check_circle_outline
            td {{ formatDateTime(line.item.createdAt) }}
            td {{ formatDateTime(line.item.updatedAt) }}
            td(align="center")
              div
                v-icon(class="mr-2" small) edit
                v-icon(small @click="deleteItem(line.item)") delete
        template(v-slot:no-data)
          div
            span(v-if="loading") Идёт загрузка данных
            span(v-if="!loading") Нет данных
    v-dialog(
      v-model="deleteDialog"
      max-width="320"
    )
      v-card
        v-toolbar(dark color="primary")
          v-toolbar-title Удалить пользователя?
        v-card-text
          div Логин: {{ itemForDelete.login }}
          div Отписание: {{ itemForDelete.description }}
          div(v-if="itemForDelete.canCreateUsers") Может создавать пользователей
          div(v-if="itemForDelete.canCreateGames") Может создавать игры
          div(v-if="itemForDelete.canBeGameMaster") Может быть мастером игры
        v-card-actions
          v-spacer
          v-btn(
            color="error"
            flat
            @click="deleteDialog = false"
          ) Нет
          v-btn(
            color="success"
            flat
            @click="deleteItem(itemForDelete, true)"
          ) Да
</template>

<script>
import * as user from '../store/actions/user'
import * as moment from 'moment-timezone'
// moment.tz.setDefault("Europe/Moscow")

export default {
  data () {
    return {
      headers: [
        { text: 'Логин', value: 'login' },
        { text: 'Описание', value: 'description' },
        { text: 'Может создавать пользователей', value: 'canCreateUsers' },
        { text: 'Может создавать игры', value: 'canCreateGames' },
        { text: 'Может быть мастером игры', value: 'canBeGameMaster' },
        { text: 'Дата создания', value: 'createdAt' },
        { text: 'Дата изменения', value: 'updatedAt' },
        { text: 'Управление', sortable: false }
      ],
      pagination: {
        rowsPerPage: -1
      },
      loading: false,
      deleteDialog: false,
      itemForDelete: {}
    }
  },
  created () {
    this.loading = true
    this.$store.dispatch(user.GET_LIST, { token: this.$store.state.auth.token })
      .then(() => {
        this.loading = false
        this.$emit('alert-show', {
          text: `Список загружен!`,
          color: 'success'
        })
      })
      .catch((err) => {
        this.loading = false
        this.$emit('alert-show', {
          text: `Ошибка ${err.status}: ${err.data.message}!`,
          color: 'error'
        })
      })
  },
  computed: {
    users () {
      return this.$store.getters.allUsers
    }
  },
  methods: {
    formatDateTime (dt) {
      return moment(dt).tz('Europe/Moscow').format('DD.MM.YYYY HH:mm:ss')
    },
    deleteItem (item, confirmed = false) {
      this.deleteDialog = !confirmed
      this.itemForDelete = item
      if (confirmed) {
        console.log(`delete item ${item._id}`)
      } else {
        console.log(`confirm delete item ${item._id}`)
      }
    }
  }
}
</script>

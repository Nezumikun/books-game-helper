<template lang="pug">
  v-content
    v-container(fluid)
      v-toolbar(flat color="white")
        v-toolbar-title Пользователи
        v-spacer
        ModalUserEdit
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
              v-icon(v-if="line.item.canCreateUsers" color="success" small) check_circle_outline
              v-icon(v-if="!line.item.canCreateUsers" color="error" small) highlight_off
            td(align="center")
              v-icon(v-if="line.item.canCreateGames" color="success" small) check_circle_outline
              v-icon(v-if="!line.item.canCreateGames" color="error" small) highlight_off
            td(align="center")
              v-icon(v-if="line.item.canBeGameMaster" color="success" small) check_circle_outline
              v-icon(v-if="!line.item.canBeGameMaster" color="error" small) highlight_off
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
          div(v-if="itemForDelete.canCreateUsers")
              v-icon(color="success" small class="mr-1") check_circle_outline
              span Может создавать пользователей
          div(v-if="!itemForDelete.canCreateUsers")
              v-icon(color="error" small class="mr-1") highlight_off
              span Не может создавать пользователей
          div(v-if="itemForDelete.canCreateGames")
              v-icon(color="success" small class="mr-1") check_circle_outline
              span Может создавать игры
          div(v-if="!itemForDelete.canCreateGames")
              v-icon(color="error" small class="mr-1") highlight_off
              span Не может создавать игры
          div(v-if="itemForDelete.canBeGameMaster")
              v-icon(color="success" small class="mr-1") check_circle_outline
              span Может быть мастером игры
          div(v-if="!itemForDelete.canBeGameMaster")
              v-icon(color="error" small class="mr-1") highlight_off
              span Не может быть мастером игры
        v-card-actions
          v-spacer
          v-btn(
            color="error"
            flat
            outline
            @click="deleteDialog = false"
            :disabled="deleteLoading"
          ) Нет
          v-btn(
            color="success"
            flat
            outline
            @click="deleteItem(itemForDelete, true)"
            :loading="deleteLoading"
            :disabled="deleteLoading"
          ) Да
</template>

<script>
import * as user from '../store/actions/user'
import * as moment from 'moment-timezone'
import ModalUserEdit from '@/components/ModalUserEdit.vue'

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
      deleteLoading: false,
      itemForDelete: {}
    }
  },
  created () {
    this.loading = true
    this.$store.dispatch(user.GET_LIST, { token: this.$store.state.auth.token })
      .then(() => {
        this.$emit('alert-show', {
          text: `Список загружен!`,
          color: 'success'
        })
      })
      .catch((err) => {
        this.$emit('alert-show', {
          text: `Ошибка ${err.status}: ${err.data.message}!`,
          color: 'error'
        })
      })
      .then(() => {
        this.loading = false
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
      this.itemForDelete = item
      if (confirmed) {
        console.log(`delete item ${item._id}`)
        this.deleteLoading = true
        this.$store.dispatch(user.DELETE, { token: this.$store.state.auth.token, item })
          .then(() => {
            this.$emit('alert-show', {
              text: `Пользователь ${item.login} удалён`,
              color: 'success'
            })
          })
          .catch((err) => {
            this.$emit('alert-show', {
              text: `Ошибка ${err.status}: ${err.data.message}!`,
              color: 'error'
            })
          })
          .then(() => {
            this.deleteLoading = false
            this.deleteDialog = false
          })
      } else {
        console.log(`confirm delete item ${item._id}`)
        this.deleteDialog = true
      }
    }
  },
  components: {
    ModalUserEdit
  }
}
</script>

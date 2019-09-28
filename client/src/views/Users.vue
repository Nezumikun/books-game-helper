<template lang="pug">
  v-content
    v-container(fluid)
      v-toolbar(flat color="white")
        v-toolbar-title Пользователи
        v-spacer
        v-dialog(v-model="editDialog" max-width="500px")
          template(v-slot:activator="{ on }")
            v-btn(color="primary" dark class="mb-2" v-on="on") Создать пользователя
          v-card
            v-toolbar(dark color="primary")
              v-toolbar-title {{ saveFormTitle }}
            v-card-text
              v-container(grid-list-md)
                v-layout(wrap)
                  v-flex(xs12 sm6 md6)
                    v-text-field(v-model="editedItem.login" label="Логин")
                  v-flex(xs12 sm6 md6 v-if="!!editedItem.password")
                    v-text-field(v-model="editedItem.password" label="Пароль")
                  v-flex(xs12 sm12 md12)
                    v-text-field(v-model="editedItem.description" label="Описание")
                  v-checkbox(v-model="editedItem.canCreateUsers" label="Может создавать пользователей")
                  v-checkbox(v-model="editedItem.canCreateGames" label="Может создавать игры")
                  v-checkbox(v-model="editedItem.canBeGameMaster" label="Может быть мастером игры")
            v-card-actions
              v-spacer
              v-btn(
                color="error"
                flat outline
                @click="closeSaveDialog"
                :disabled="saveLoading"
              ) Отмена
              v-btn(
                color="success"
                flat outline
                @click="save"
                :loading="saveLoading"
                :disabled="saveLoading"
              ) Сохранить
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
                v-icon(class="mr-2" small @click="editItem(line.item)") edit
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

const emptyItem = {
  login: '',
  password: '',
  description: '',
  canCreateUsers: false,
  canCreateGames: false,
  canBeGameMaster: false
}

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
      itemForDelete: {},
      editedItem: { ...emptyItem },
      saveLoading: false,
      editDialog: false
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
    },
    saveFormTitle () {
      return (this.editedItem._id) ? `Изменить ${this.editedItem.username}` : 'Новый пользователь'
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
              text: `Ошибка ${err.response.status}: ${err.response.data.message}!`,
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
    },
    editItem (item, confirmed = false) {
      this.editedItem = { ...item }
      if (confirmed) {
        this.save()
      } else {
        this.editDialog = true
      }
    },
    save () {
      this.saveLoading = true
      this.$store.dispatch(user.SAVE, {
        token: this.$store.state.auth.token,
        item: { ...this.editedItem }
      })
        .then(() => {
          this.$emit('alert-show', {
            text: `Пользователь записан!`,
            color: 'success'
          })
          this.editDialog = false
        })
        .catch((err) => {
          this.$emit('alert-show', {
            text: (err.response) ? `Ошибка ${err.response.status}: ${err.response.data.message}!` : `Ошибка: ${err}`,
            color: 'error'
          })
        })
        .then(() => {
          this.saveLoading = false
          this.editedItem = { ...emptyItem }
        })
    },
    closeSaveDialog () {
      this.editDialog = false
      this.editedItem = { ...emptyItem }
    }
  },
  components: {
  }
}
</script>

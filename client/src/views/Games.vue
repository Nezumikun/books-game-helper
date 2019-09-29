<template lang="pug">
  v-content
    v-container(fluid)
      v-toolbar(flat color="white")
        v-toolbar-title Игры
        v-spacer
        v-dialog(v-model="editDialog" max-width="500px")
          template(v-slot:activator="{ on }")
            v-btn(color="primary" dark class="mb-2" v-on="on") Создать игру
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
        :items="games"
        :pagination="pagination"
        :loading="loading"
        class="elevation-1"
        hide-actions
      )
        v-progress-linear(v-slot:progress color="blue" indeterminate)
        template(v-slot:items="line")
          tr
            td {{ line.item.title }}
            td {{ line.item.creator.login }}
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
import * as game from '../store/actions/game'
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
        { text: 'Название', value: 'title' },
        { text: 'Создатель', value: 'creator.login' }
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
    this.$store.dispatch(game.GET_LIST, { token: this.$store.state.auth.token })
      .then(() => {
        console.log(this.$store.getters.allGames)
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
    games () {
      return this.$store.getters.allGames
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
        this.$store.dispatch(game.DELETE, { token: this.$store.state.auth.token, item })
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
      this.$store.dispatch(game.SAVE, {
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

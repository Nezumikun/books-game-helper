<template lang="pug">
  v-dialog(v-model="dialog" max-width="500px")
    template(v-slot:activator="{ on }")
      v-btn(color="primary" dark class="mb-2" v-on="on") Создать пользователя
    v-card
      v-toolbar(dark color="primary")
        v-toolbar-title {{ formTitle }}
      v-card-text
        v-container(grid-list-md)
          v-layout(wraз)
            v-flex(xs12 sm6 md4)
              v-text-field(v-model="editedItem.name" label="Dessert name")
            v-flex(xs12 sm6 md4)
              v-text-field(v-model="editedItem.calories" label="Calories")
            v-flex(xs12 sm6 md4)
              v-text-field(v-model="editedItem.fat" label="Fat (g)")
      v-card-actions
        v-spacer
        v-btn(
          color="error"
          flat
          @click="close"
        ) Отмена
        v-btn(
          color="success"
          flat
          @click="save"
        ) Сохранить
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      formTitle: 'Новый пользователь',
      editedItem: {
        name: '',
        calories: '',
        fat: ''
      }
    }
  },
  methods: {
    close () {
      this.dialog = false
    }
  }
}
</script>

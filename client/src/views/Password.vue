<template lang="pug">
  v-content
    v-container(fluid)
      v-layout(justify-center)
        v-flex(xs12 sm12 md8 lg4)
          v-card(ref="form")
            v-toolbar(dark color="primary")
              v-toolbar-title Смена пароля текущего пользователя
            v-card-text
              v-form(v-model="valid")
                h3 Старый пароль
                v-text-field(v-model="currentPassword" :rules="rulesCurrentPassword" label="Действующий пароль" required autofocus :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'" :type="showCurrentPassword ? 'text' : 'password'" @click:append="showCurrentPassword = !showCurrentPad")
                v-divider
                h3(class="mt-3") Новый пароль
                v-text-field(v-model="newPassword" :rules="rulesNewPassword" label="Новый пароль" required :append-icon="showNewPassword ? 'visibility' : 'visibility_off'" :type="showNewPassword ? 'text' : 'password'" @click:append="showNewPassword = !showNewPassword")
                v-text-field(v-model="repeatPassword" :rules="rulesRepeatPassword" label="Повторный ввод нового пароля" required :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'" :type="showRepeatPassword ? 'text' : 'password'" @click:append="showRepeatPassword = !showRepeatPassword")
            v-card-actions
              v-spacer
              v-btn(color="success" depressed :disabled="!valid") Сменить
</template>

<script>
export default {
  name: 'password',
  data () {
    return {
      valid: true,
      currentPassword: '',
      showCurrentPassword: false,
      rulesCurrentPassword: [
        v => !!v || 'Поле должно быть заполнено'
      ],
      newPassword: '',
      showNewPassword: false,
      rulesNewPassword: [
        v => !!v || 'Поле должно быть заполнено',
        v => ((this.repeatPassword === '') || (v === this.repeatPassword)) || 'Повторный ввод пароля отличается'
      ],
      repeatPassword: '',
      showRepeatPassword: false,
      rulesRepeatPassword: [
        v => !!v || 'Поле должно быть заполнено',
        v => (v === this.newPassword) || 'Повторный ввод пароля отличается'
      ]
    }
  }
}
</script>

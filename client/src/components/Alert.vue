<template>
  <v-snackbar
        v-model="snackbar"
        bottom
        right
        :color="color"
        :timeout="timeout"
  >
    {{ text }}
    <v-btn
      dark
      flat
      @click="snackbar = false"
    >
      <v-icon>
        close
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      snackbar: false,
      color: 'info',
      timeout: 3000
    }
  },
  methods: {
    show: function (data) {
      this.text = data.text || ''
      this.color = data.color || 'info'
      this.snackbar = true
    }
  }
}
</script>

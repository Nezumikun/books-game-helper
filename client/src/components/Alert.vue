<template>
  <v-snackbar
        v-model="snackbar"
        bottom
        right
        :color="color"
        :timeout="timeout"
      >
        {{ text }}
        <v-icon
          color="pink"
          @click="snackbar = false"
        >
          mdi-close
        </v-icon>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      snackbar: false,
      color: 'info',
      timeout: 6000
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

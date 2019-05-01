<template>
  <v-snackbar
        v-model="snackbar"
        bottom
        right
        :timeout="timeout"
      >
        {{ text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
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

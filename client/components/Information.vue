<template>
  <!-- info -->
  <v-dialog v-model="dialog" width="70%">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </template>
    <v-card class="info-modal">
      <!-- xo -->
      <!-- eslint-disable -->
      <v-card tile class="section pa-4">
        <v-row no-gutters class="xo">
          <v-col>
            <v-card class="card pa-2" outlined tile>
              <p class="text-left">
                <span class="display-2">XO </span>
                {{ $t("info.about") }}
                <a
                  href="https://www.google.com/search?q=Tic-Tac-Toe"
                  target="_blank"
                >Tic-Tac-Toe</a>.
              </p>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="card left pa-2" outlined tile>
              <img class="img-mobile" src="../static/xo_mobile.png" alt="image">
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <!-- tech -->
      <!-- eslint-disable -->
      <v-card tile class="section pa-4">
        <v-row no-gutters class="tech">
          <v-col>
            <v-card class="card left pa-2" outlined tile>
              <img src="../static/nuxtjs_logo.png" alt="image" >
              <img src="../static/socketio_logo.png" alt="image" >
              <img src="../static/vuejs_logo.png" alt="image" >
              <img src="../static/vuetify_logo.png" alt="image" >
            </v-card>
          </v-col>
          <v-col>
            <v-card class="card pa-2" outlined tile>
              <p class="text-left">
                <span class="display-2">Tech </span>{{ $t('info.tech.consist') }}
                <a
                  href="https://nuxtjs.org/"
                  target="_blank">Nuxt.js</a> {{ $t('info.tech.structure') }}
                <a
                  href="https://socket.io/"
                  target="_blank">Socket.io</a> {{ $t('info.tech.real-time') }}. {{ $t('info.tech.frontend') }}
                <a
                  href="https://vuetifyjs.com/"
                  target="_blank">Vuetify</a>, {{ $t('info.tech.md-framework') }}. {{ $t('info.tech.rendered') }}
                <a
                  href="https://developer.mozilla.org/de/docs/Web/SVG/Element/svg/"
                  target="_blank">SVG-{{ $t('info.tech.elements') }}</a> {{ $t('info.tech.wrapped') }}
                <a
                  href="https://vuejs.org/v2/guide/components"
                  target="_blank">Vue-{{ $t('info.tech.components') }}</a>.
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Information",
  data() {
    return {
      dialog: false
    }
  }
}
</script>

<style lang="scss" scoped>
.info-modal {
  .section {
    @media (max-width: 500px) {
      .row {
        &.xo {
          flex-direction: column-reverse;
        }

        &.tech {
          flex-direction: column;
        }
      }
    }

    .card {
      min-height: 200px;
      border: 0;

      &.left {
        text-align: center;
      }

      .img-mobile {
        height: 180px;
      }
    }
  }
}
</style>

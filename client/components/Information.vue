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
                <span class="display-2">XO</span> is a 1v1 round-based
                browser-game supporting desktop and mobile devices. It is
                inspired by the game
                <a
                  href="https://de.wikipedia.org/wiki/Tic-Tac-Toe/"
                  target="_blank"
                >Tic-Tac-Toe</a>
                . Instead of drawing X's and O's you have to draw border edges
                of those by touching them. The goal is to close as much borders
                as possible.
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
                <span class="display-2">Tech</span> stack consist of
                <a
                  href="https://nuxtjs.org/"
                  target="_blank">Nuxt.js</a> for app structure and
                <a
                  href="https://socket.io/"
                  target="_blank">Socket.io</a> for real-time communication. The Frontend is build and composed with
                <a
                  href="https://developer.mozilla.org/de/docs/Web/SVG/Element/svg/"
                  target="_blank">SVG-Elements</a>wrapped in
                <a
                  href="https://vuejs.org/v2/guide/components"
                  target="_blank">Vue-Components</a>. In addition to that the app uses
                <a
                  href="https://vuetifyjs.com/"
                  target="_blank">Vuetify</a> as a Material Design Component Framework.
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

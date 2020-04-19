<template>
  <!-- Default Layout -->
  <v-app dark>
    <!-- top-nav-bar -->
    <v-app-bar fixed>
      <!-- eslint-disable -->
      <img class="xo-logo" src="../static/xo-logo-36x36.png">
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon class="pt-1">
            <v-icon v-on="on">
              mdi-account-group
            </v-icon>
            <v-badge class="user-count">
              {{ usersCount }}
            </v-badge>
          </v-btn>
        </template>
        <span>{{ $t('appbar.users-online') }}</span>
      </v-tooltip>
      <Information />
      <div class="lang d-flex justify-center" v-ripple>
        <select v-model="$root.$i18n.locale">
          <option
            v-for="(lang, i) in langs"
            :key="`Lang${i}`"
            :value="lang"
            :selected="lang === 'de'"
          >
            {{ lang }}
          </option>
        </select>
      </div>
    </v-app-bar>

    <!-- content -->
    <v-content>
      <v-container>
        <nuxt v-if="isWebSocketProvided()" />
        <div v-else class="no-websocket-text">
          Sorry, your Browser does not support WebSockets. You might want to
          check
          <footer>
            <v-btn
              href="https://caniuse.com/#feat=websockets"
              target="blank"
              color="blue"
              text
              small
            >
              supported Browsers
            </v-btn>
          </footer>
        </div>
      </v-container>
    </v-content>

    <!-- footer -->
    <v-footer :fixed="fixed" app>
      <span>{{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Information from "@/components/Information"
import socket from "~/plugins/socket.io.js"

export default {
  name: "Default",
  components: {
    Information
  },
  data() {
    return {
      title: "XO Demo",
      clipped: false,
      fixed: false,
      usersCount: "",
      langs: ['en', 'de'],
    }
  },
  created() {
    socket.emit("user-count")
    socket.on("user-count", data => {
      this.usersCount = data.usersCount
    })
  },
  methods: {
    isWebSocketProvided: function() {
      return "WebSocket" in window || "MozWebSocket" in window
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  margin-top: 64px;
}

footer {
  justify-content: center;
}

.xo-logo {
  margin-right: 16px;
}

.no-websocket-text {
  text-align: center;
}

.lang {
  height: 48px;
  width: 48px;
  font-size: 16px;
  border-radius: 50%;

  select {
    text-transform: uppercase;
    &:focus {
      outline: 0;
    }
    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    background-color: #f4f4f4;
  }
}

.user-count {
  position: absolute;
  top: -8px;
  font-size: 10px;
}
</style>

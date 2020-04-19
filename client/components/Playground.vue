<template>
  <!-- Playground -->
  <div class="playground">
    <!-- Ready Check -->
    <v-card v-if="!ready && !gameStarted && !gameEnd" class="text-center">
      <v-card-text class="pb-0">
        <p class="title">
          {{ $t("game.ready") }}
        </p>
      </v-card-text>
      <GridSelect />
      <v-btn color="primary accent-4" text @click="readyCheck()">
        Start
      </v-btn>
    </v-card>

    <!-- Game Start -->
    <div>
      <div v-if="gameStarted || gameEnd || opponentLeft">
        <v-overlay
          :value="gameEnd || opponentLeft"
          :absolute="true"
          :opacity="0.32"
          :z-index="1"
        />
        <!-- Render Scoreboard and GridMobile -->
        <Scoreboard />
        <GridMobile />
      </div>
    </div>

    <!-- Game End -->
    <v-card v-if="gameEnd" class="game-over" outlined>
      <v-list-item three-line>
        <v-list-item-content class="text-center">
          <v-list-item-title v-if="victory.me" class="mb-1 win">
            {{ $t("game.win") }}
          </v-list-item-title>
          <v-list-item-title v-if="victory.opponent" class="mb-1 defeat">
            {{ $t("game.lost") }}
          </v-list-item-title>
          <v-list-item-title v-if="victory.draw" class="mb-1">
            Draw
          </v-list-item-title>
          <v-list-item-subtitle>Play again?</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="pb-0">
        <v-btn color="primary" class="width-half" text @click="restartGame()">
          Yes
        </v-btn>
        <v-btn color="primary" class="width-half ml-0" text @click="endGame()">
          No
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Opponent Search -->
    <v-card v-if="opponentSearch" align="center">
      <v-card-text>
        <p class="title mb-0">
          Searching for opponent
        </p>
      </v-card-text>
      <v-progress-circular :size="50" color="primary" indeterminate />
      <v-list-item-content class="search-grid px-4 mt-4">
        {{ grid }}
      </v-list-item-content>
      <v-card-actions class="cancel-search py-0">
        <v-btn color="primary" text @click="endGame()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Opponent Left -->
    <v-card v-if="opponentLeft" class="opponent-left">
      <v-card-text>
        <p class="title">
          Opponent left the game.
        </p>
      </v-card-text>
      <v-card-actions class="pb-0">
        <v-btn color="primary" class="width-half" text @click="restartGame()">
          Restart Search
        </v-btn>
        <v-btn color="primary" class="width-half ml-0" text @click="endGame()">
          End Game
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import GridMobile from "@/components/GridMobile"
import Scoreboard from "@/components/Scoreboard"
import GridSelect from "@/components/GridSelect"
import socket from "~/plugins/socket.io.js"
import { mapGetters, mapMutations } from "vuex"

export default {
  name: "Playground",
  components: {
    GridMobile,
    Scoreboard,
    GridSelect
  },
  data() {
    return {
      ready: false,
      opponentSearch: false,
      opponentLeft: false,
      gameEnd: false
    }
  },
  computed: {
    gameStarted() {
      return this.getStart()
    },
    victory() {
      const users = this.getUsers()
      if (!users.length) return { me: false, opponent: false, draw: false }
      const myScore = users.filter(user => !user.opponent)[0]
      const opponentScore = users.filter(user => user.opponent)[0]
      const result = {
        me: myScore.score > opponentScore.score,
        opponent: myScore.score < opponentScore.score,
        draw: myScore.score === opponentScore.score
      }
      return result
    },
    grid() {
      const gridConfig = this.getGrid()
      return `${gridConfig.xCubeCount}x${gridConfig.yCubeCount}`
    }
  },
  beforeMount() {
    // sync game start
    socket.on("game-start", data => {
      // set and store users info
      data.users.forEach(userId => {
        this.storeUser({
          id: userId,
          opponent: socket.id !== userId,
          room: data.room,
          score: 0
        })
      })
      // stop queue and start game
      this.opponentSearch = false
      this.setStart({ value: true })
      // emit game start for client components
      this.$bus.$emit("game-start")
    })
    // sync turn
    socket.on("game-turn", () => {
      this.toggleTurn()
    })
    // user left
    socket.on("user-left", () => {
      if (this.getStart()) {
        this.opponentLeft = true
      }
    })
  },
  mounted() {
    // end game if active cubes reached max count
    // TODO:: Outsourcing getters (failed once somehow)
    this.$store.watch((state, getters) => {
      if (getters["cubes/length"] === this.maxCubeCount()) {
        const room = this.getRoom()
        setTimeout(() => {
          socket.emit("game-end", room)
        }, 100)
        this.gameEnd = true
        this.ready = false
      }
    })
  },
  methods: {
    ...mapGetters({
      maxCubeCount: "grid/maxCubeCount",
      getGrid: "grid/config",
      getStart: "game/getStart",
      getRoom: "users/getRoomId",
      getUsers: "users/all"
    }),
    ...mapMutations({
      storeUser: "users/add",
      setStart: "game/setStart",
      toggleTurn: "game/toggleTurn",
      resetTurn: "game/resetTurn",
      resetCubes: "cubes/reset",
      resetEdges: "edges/reset",
      resetUsers: "users/reset"
    }),
    readyCheck() {
      socket.emit("ready-check", this.grid)
      this.opponentSearch = true
      this.ready = true
    },
    resetGame() {
      this.setStart({ value: false })
      this.resetCubes()
      this.resetEdges()
      this.resetTurn()
      this.resetUsers()
    },
    restartGame() {
      this.resetGame()
      this.readyCheck()
      this.gameEnd = false
      this.opponentLeft = false
    },
    endGame() {
      socket.emit("game-end")
      this.resetGame()
      this.gameEnd = false
      this.opponentSearch = false
      this.opponentLeft = false
      this.ready = false
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  margin: 16px 0;
}

.search-grid {
  width: 64px;
  height: 48px;
  color: #1976d2;
  background-color: #e4effa;
  line-height: 1.1;
  font-size: 1.25rem;
}

.cancel-search {
  justify-content: center;
}

.opponent-left,
.game-end,
.game-over {
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  top: 128px;
  margin: 0 8px;
  z-index: 2;

  .v-list-item__title {
    font-size: 1.25rem;
  }

  .win {
    color: green;
  }

  .defeat {
    color: #fa8a80;
  }
}

.width-half {
  width: 50%;
}

.v-overlay {
  border-radius: 4px;
}
</style>

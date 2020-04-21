<template>
  <!-- Scoreboard -->
  <div class="score-board d-flex">
    <div :class="{ 'focus-green': myTurn }" class="player-container left ml-2">
      <p class="name body-2 mb-0">
        {{ $t("game.you") }}
      </p>
      <p class="score">
        {{ players.me.score }}
      </p>
    </div>
    <p class="text-center score">
      :
    </p>
    <div
      :class="{ 'focus-green': !myTurn && focusOpponentEnabled }"
      class="player-container right mr-2"
    >
      <p class="score">
        {{ players.opponent.score }}
      </p>
      <p class="name body-2 mb-0">
        {{ $t("game.opponent") }}
      </p>
    </div>
  </div>
</template>

<script>
import socket from "~/plugins/socket.io.js"
import { mapGetters, mapMutations } from "vuex"

export default {
  name: "Scoreboard",
  data() {
    return {
      players: {
        me: {
          id: "",
          score: 0
        },
        opponent: {
          id: "",
          score: 0
        }
      },
      focusOpponentEnabled: false
    }
  },
  computed: {
    myTurn() {
      return this.turn()
    }
  },
  created() {
    // sync score
    this.$bus.$on("score", () => {
      ++this.players.me.score
      this.storeScore(this.players.me.id)
      const opponentId = this.players.opponent.id
      if (opponentId !== "") {
        socket.emit("score", { opponentId: opponentId, roomId: this.roomId() })
      }
    })
    // sync opponent score
    socket.on("opponent-score", () => {
      ++this.players.opponent.score
      this.storeScore(this.players.opponent.id)
    })
    // activate opponent edge
    this.$bus.$on("edge-activate", edgeId => {
      const opponentId = this.players.opponent.id
      if (opponentId !== "") {
        socket.emit("edge-activate", { edgeId: edgeId, opponentId: opponentId })
      }
    })
  },
  beforeDestroy() {
    socket.off("opponent-score")
    this.$bus.$off("edge-activate")
    this.$bus.$off("score")
  },
  mounted() {
    this.players.me.id = socket.id
    this.players.opponent.id = this.opponentId()
    this.focusOpponentEnabled = true
  },
  methods: {
    ...mapGetters({
      opponentId: "users/getOpponentId",
      turn: "game/getTurn",
      roomId: "users/getRoomId"
    }),
    ...mapMutations({
      storeScore: "users/addScore"
    })
  }
}
</script>

<style lang="scss" scoped>
.score-board {
  align-items: center;
  padding: 24px 0;
}

.score {
  min-width: 12%;
  font-size: 28px;
  margin-bottom: 0;
}

.focus-green {
  box-shadow: 0 0 5px 1px green;
  border-radius: 4px;
  color: green;
}

.player-container {
  display: flex;
  align-items: center;
  padding: 0 4px;

  .name {
    margin: 0 auto;
    overflow: hidden;
  }

  &.left {
    width: 44%;
    justify-content: flex-end;

    .score {
      margin-left: 8px;
    }
  }

  &.right {
    width: 44%;
    justify-content: flex-start;

    .score {
      margin-right: 8px;
    }
  }
}
</style>

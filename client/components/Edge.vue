<template>
  <!-- Edge -->
  <g :id="`${id}-group`">
    <!-- Main Edge -->
    <rect
      :id="id"
      :x="x"
      :y="y"
      :width="width"
      :height="height"
      :rx="rx"
      :ry="ry"
      :style="{
        stroke: colorStroke,
        fill: color
      }"
    />
    <!-- Edge Overlay -->
    <rect
      :id="`${id}-overlay`"
      :x="x - (!isHorizontal ? width * 1.4 : 0)"
      :y="y - (isHorizontal ? height * 1.4 : 0)"
      :width="width * (!isHorizontal ? 4 : 1)"
      :height="height * (isHorizontal ? 4 : 1)"
      :rx="rx * 30"
      :ry="ry * 30"
      :style="{
        opacity: 0,
        stroke: 'none'
      }"
      @click="clicked"
      @mouseover="changeColor(hoverColor, hoverColorStroke)"
      @mouseleave="changeColor(defaultColor, defaultStrokeColor)"
    />
    <!-- Cube top and left -->
    <cube
      v-if="!isBorder && renderCubes.first"
      :x="calcCubeXPosition('first') - 0.5"
      :y="calcCubeYPosition('first') - 0.5"
      :edge-length="edgeLength"
    />
    <!-- Cube bottom and right -->
    <cube
      v-if="!isBorder && renderCubes.second"
      :x="calcCubeXPosition('second') - 0.5"
      :y="calcCubeYPosition('second') - 0.5"
      :edge-length="edgeLength"
    />
  </g>
</template>

<script>
import Cube from "@/components/Cube/Cube"
import { mapGetters, mapMutations } from "vuex"
import socket from "~/plugins/socket.io.js"

export default {
  name: "Edge",
  components: {
    Cube
  },
  props: {
    x: {
      type: Number,
      required: false,
      default: 10
    },
    y: {
      type: Number,
      required: false,
      default: 10
    },
    width: {
      type: Number,
      required: false,
      default: 50
    },
    height: {
      type: Number,
      required: false,
      default: 50
    },
    rx: {
      type: Number,
      required: false,
      default: 10
    },
    ry: {
      type: Number,
      required: false,
      default: 10
    },
    id: {
      type: String,
      required: false,
      default: ""
    },
    isHorizontal: {
      type: Boolean,
      required: true,
      default: false
    },
    borderPaddingHoriz: {
      type: Number,
      required: false,
      default: 10
    },
    borderPaddingVerti: {
      type: Number,
      required: false,
      default: 10
    },
    xCubeCount: {
      type: Number,
      required: false,
      default: 10
    },
    yCubeCount: {
      type: Number,
      required: false,
      default: 10
    },
    edgeLength: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      active: false,
      renderCubes: {
        first: false,
        second: false
      },
      isBorder: false,
      overlayOpacity: 0,
      color: "",
      colorStroke: "",
      defaultColor: "#eceff1",
      defaultStrokeColor: "#cfd8dc",
      activeColor: "#42a5f5",
      activeColorStroke: "#1e88e5",
      hoverColor: "#c5e3fc",
      hoverColorStroke: "#9bcaf3"
    }
  },
  computed: {
    edgeLengthHalf: function() {
      return this.edgeLength / 2
    },
    paddingOffset: function() {
      return this.borderPaddingVerti - this.borderPaddingHoriz
    }
  },
  created() {
    this.color = this.defaultColor
    this.colorStroke = this.defaultStrokeColor
  },
  beforeDestroy() {
    socket.off("opponent-edge-activate")
  },
  mounted() {
    this.drawBorder()
    // add edge to local storage
    this.storeEdge({
      id: this.id,
      isActive: this.active,
      svg: this.$el.childNodes[0],
      isHorizontal: this.isHorizontal
    })
    // sync edge with opponent
    if (!this.active) {
      socket.on("opponent-edge-activate", edgeId => {
        if (edgeId === this.id) {
          this.setActive()
          this.checkCompletedCubes(false)
        }
      })
    }
  },
  methods: {
    ...mapGetters({
      allEdges: "edges/all",
      myTurn: "game/getTurn",
      opponentId: "users/getOpponentId",
      roomId: "users/getRoomId"
    }),
    ...mapMutations({
      storeCube: "cubes/add",
      storeEdge: "edges/add",
      activateEdge: "edges/activateEdge",
      toggleTurn: "game/toggleTurn"
    }),
    /**
     * Calculate the x-position of the first and second Cube given as parameter string.
     *
     * @param {string} cubeOrder 'First' or 'Second'
     * @return {Number} The x-position of the cube
     */
    calcCubeXPosition(cubeOrder) {
      if (this.isHorizontal) {
        return this.x + this.edgeLengthHalf
      } else {
        if (cubeOrder === "first") {
          return this.x - this.edgeLengthHalf + this.paddingOffset
        }
        if (cubeOrder === "second") {
          return this.x + this.edgeLengthHalf + this.paddingOffset
        }
      }
    },
    /**
     * Calculate the y-position of the first and second Cube given as parameter string.
     *
     * @param {string} cubeOrder 'First' or 'Second'
     * @return {Number} The x-position of the cube
     */
    calcCubeYPosition(cubeOrder) {
      if (this.isHorizontal) {
        if (cubeOrder === "first") {
          return this.y - this.edgeLengthHalf + this.paddingOffset
        }
        if (cubeOrder === "second") {
          return this.y + this.edgeLengthHalf + this.paddingOffset
        }
      } else {
        return this.y + this.edgeLengthHalf
      }
    },
    /**
     * Changes edge color of the edge
     *
     * @param {string} color
     * @param {string} strokeColor
     */
    changeColor(color, strokeColor) {
      if (this.active) return
      this.color = color
      this.strokeColor = strokeColor
    },
    /**
     * Checks if the edge is a border by edges x/y-min/max position and sets it to active.
     * (NOTE: THIS ONLY WORKS FOR SQAURES! May be define border with the count of adjacents?)
     */
    drawBorder() {
      if (
        (this.isHorizontal && this.y === this.borderPaddingHoriz) ||
        (this.isHorizontal &&
          this.y ===
            this.borderPaddingHoriz + this.yCubeCount * this.edgeLength) ||
        (!this.isHorizontal && this.x === this.borderPaddingHoriz) ||
        (!this.isHorizontal &&
          this.x ===
            this.borderPaddingHoriz + this.xCubeCount * this.edgeLength)
      ) {
        this.setActive()
        this.isBorder = true
      }
    },
    /**
     * Sets edge to active and checks cubes for completion.
     * Emits event, toggles turn and prevents all if not your turn.
     */
    clicked() {
      if (!this.myTurn()) return
      if (this.active) return
      this.setActive()
      this.$bus.$emit("edge-activate", this.id)
      const scored = this.checkCompletedCubes()
      // no score no toggle turn
      if (!scored) {
        this.toggleTurn()
        socket.emit("game-turn", {
          opponentId: this.opponentId(),
          roomId: this.roomId()
        })
      }
    },
    /**
     * Checks if stored cubes-edges are active. A cube is complete if all its edges are active (count 4).
     * If so store cube in storage and render it. Also manages sync operations and game turn logic.
     *
     * @param {Boolean} sync Emits to ws if true.
     * @return {Boolean} Is true if has been scored else false.
     */
    checkCompletedCubes(sync = true) {
      const edges = this.allEdges().filter(edge => this.id === edge.id)
      let score = false
      if (edges.length > 0) {
        const cubes = edges[0].cubes
        // get active edges from cubes
        const firstCubeActiveEdges = cubes.first
          .filter(e => e.isActive)
          .map(e => e.edgeId)
        const secondCubeActiveEdges = cubes.second
          .filter(e => e.isActive)
          .map(e => e.edgeId)
        // if 'first' is complete => SCORE
        if (firstCubeActiveEdges.length === 4) {
          // add cube to storage and render
          this.storeCube({ cube: firstCubeActiveEdges })
          this.renderCubes.first = true
          score = true
          if (sync) this.$bus.$emit("score", { id: `${this.id}-first-cube` })
        }
        // if 'second' is complete => SCORE
        if (secondCubeActiveEdges.length === 4) {
          // add cube to storage and render
          this.storeCube({ cube: secondCubeActiveEdges })
          this.renderCubes.second = true
          score = true
          if (sync) this.$bus.$emit("score", { id: `${this.id}-second-cube` })
        }
      }
      return score
    },
    /**
     * Sets this edge to active and updates storage.
     */
    setActive() {
      this.active = true
      this.color = this.activeColor
      this.colorStroke = this.activeColorStroke
      this.activateEdge({
        id: this.id
      })
    }
  }
}
</script>

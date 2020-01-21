<template>
  <!-- Grid Template -->
  <svg
    id="grid"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="maxWidth"
  >
    <g class="edges">
      <edge
        v-for="n in cfg.yCubeCount * (cfg.xCubeCount + 1)"
        :id="`vert-edge-${n}`"
        :key="'vert-edge' + n"
        :isHorizontal="false"
        :x="borderPaddingHoriz + getBarXpos(n, 1)"
        :y="getVertBarYPos(n)"
        :height="cfg.edgeLength - 1"
        :width="cfg.edgeWidth"
        :rx="cfg.borderRadius"
        :ry="cfg.borderRadius"
        :borderPaddingHoriz="borderPaddingHoriz"
        :borderPaddingVerti="borderPaddingVerti"
        :xCubeCount="cfg.xCubeCount"
        :yCubeCount="cfg.yCubeCount"
        :edgeLength="cfg.edgeLength"
      />
      <edge
        v-for="n in cfg.xCubeCount * (cfg.yCubeCount + 1)"
        :id="`horiz-edge-${n}`"
        :key="'horiz-edge' + n"
        :isHorizontal="true"
        :x="borderPaddingVerti + getBarXpos(n)"
        :y="borderPaddingHoriz + getHoriBarYPos(n)"
        :height="cfg.edgeWidth"
        :width="cfg.edgeLength - 1"
        :rx="cfg.borderRadius"
        :ry="cfg.borderRadius"
        :borderPaddingHoriz="borderPaddingHoriz"
        :borderPaddingVerti="borderPaddingVerti"
        :xCubeCount="cfg.xCubeCount"
        :yCubeCount="cfg.yCubeCount"
        :edgeLength="cfg.edgeLength"
      />
    </g>
  </svg>
</template>

<script>
import Edge from "./Edge"
import { mapGetters, mapMutations } from "vuex"

export default {
  name: "GridTemplate",
  components: {
    Edge
  },
  props: {
    cfg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      borderPaddingHoriz: 0.5,
      borderPaddingVerti: 5
    }
  },
  computed: {
    maxWidth() {
      return 1 + this.cfg.edgeWidth + this.cfg.xCubeCount * this.cfg.edgeLength
    }
  },
  mounted() {
    this.adaptGridHeight()
    this.generateCubes()
  },
  methods: {
    ...mapGetters({
      allEdges: "edges/all"
    }),
    ...mapMutations({
      addCubesToEdge: "edges/addCubesToEdge"
    }),
    /**
     * Returns the x position of the horinzontal bars considering the xCubeCount and edgeLength.
     *
     * @param {Number} n X-position of the Edge
     * @param {Number} extraRow
     * @return {Number} X-position
     */
    getBarXpos(n, extraRow = 0) {
      const column =
        this.cfg.edgeLength * (n % (this.cfg.xCubeCount + extraRow))
      return column
    },
    /**
     * Returns the y position of the horinzontal bars considering the yCubeCount and edgeLength.
     *
     * @param {Number} n Y-position of the Edge
     * @return {Number} Y-position
     */
    getHoriBarYPos(n) {
      const result =
        this.cfg.edgeLength * Math.trunc((n - 1) / this.cfg.xCubeCount)
      return result
    },
    /**
     * Returns the y position of the vertical bars considering the xCubeCount and edgeLength.
     *
     * @param n Number
     */
    getVertBarYPos(n) {
      if (n === 0) {
        return 1
      }
      const row = Math.floor((n - 1) / (this.cfg.xCubeCount + 1))
      return this.borderPaddingVerti + this.cfg.edgeLength * row
    },
    /**
     * Adapt the grid height.
     */
    adaptGridHeight() {
      const edgesContainerHeight = document
        .querySelectorAll(".edges")[0]
        .getBBox().height
      document
        .querySelectorAll("#grid")[0]
        .setAttribute("height", edgesContainerHeight + this.borderPaddingVerti)
    },
    /**
     * Generates all cubes by the inner and inactive edges adjacents.
     * Adjacents are being splitted vertically into left and right. And splitted horizontally into top and bottom.
     * Then edges adjacents are being mapped into to 'first' and 'second' cubes.
     */
    generateCubes() {
      const self = this
      // for every inactive edge in local storage.
      // (Initially only border-edges are active and have only empty cubes {})
      this.allEdges().forEach(edge => {
        if (edge.isActive) return
        const edgeBCR = edge.svg.getBoundingClientRect()
        const thisEdge = { edgeId: edge.id, isActive: edge.isActive }
        const adjacents = {
          left: [thisEdge],
          right: [thisEdge],
          top: [thisEdge],
          bottom: [thisEdge]
        }
        // search for other adjacent edges in the storage
        self.allEdges().forEach(item => {
          if (edge.id !== item.id) {
            const itemBCR = item.svg.getBoundingClientRect()
            if (
              self.isOrthogonal(edgeBCR, itemBCR) ||
              self.isOpposite(edgeBCR, itemBCR, edge.isHorizontal)
            ) {
              const itemEdge = { edgeId: item.id, isActive: item.isActive }
              // and split by axis
              if (!edge.isHorizontal) {
                if (itemBCR.x <= edgeBCR.x) {
                  adjacents.left.push(itemEdge)
                } else {
                  adjacents.right.push(itemEdge)
                }
              } else {
                if (itemBCR.y <= edgeBCR.y) {
                  adjacents.top.push(itemEdge)
                } else {
                  adjacents.bottom.push(itemEdge)
                }
              }
            }
          }
        })
        // map adjacents to cubes
        let cubes = {}
        if (!edge.isHorizontal) {
          cubes = {
            first: adjacents.left.length < 4 ? [] : adjacents.left,
            second: adjacents.right.length < 4 ? [] : adjacents.right
          }
        } else {
          cubes = {
            first: adjacents.top.length < 4 ? [] : adjacents.top,
            second: adjacents.bottom.length < 4 ? [] : adjacents.bottom
          }
        }
        // and add to storage
        this.addCubesToEdge({
          edgeId: edge.id,
          cubes: cubes
        })
      })
    },
    /**
     * Compares two {svg.getBoundingClientRect()} objects and returns true if the second is horizontal and overlaping the first.
     *
     * @param {object} firstBCR
     * @param {object} secondBCR
     * @return {boolean}
     */
    isOrthogonal(firstBCR, secondBCR) {
      return !(
        firstBCR.right < secondBCR.left ||
        firstBCR.left > secondBCR.right ||
        firstBCR.bottom < secondBCR.top ||
        firstBCR.top > secondBCR.bottom
      )
    },
    /**
     * Compares two {svg.getBoundingClientRect()} objects and returns true if the second is directly opposite to the first.
     *
     * @param {object} firstBCR
     * @param {object} secondBCR
     * @param {boolean} isHorizontal
     * @return {boolean}
     */
    isOpposite(firstBCR, secondBCR, isHorizontal) {
      if (!isHorizontal) {
        const rect1XPos = Math.round(firstBCR.x * 1e3) / 1e3
        const rect2XPos = Math.round(secondBCR.x * 1e3) / 1e3
        const isRightOpposite = rect1XPos + this.cfg.edgeLength === rect2XPos
        const isLeftOpposite = rect1XPos - this.cfg.edgeLength === rect2XPos
        const hasSameYPos = firstBCR.y === secondBCR.y
        if (
          (hasSameYPos && isRightOpposite) ||
          (hasSameYPos && isLeftOpposite)
        ) {
          return true
        }
      } else {
        const rect1YPos = Math.round(firstBCR.y * 1e3) / 1e3
        const rect2YPos = Math.round(secondBCR.y * 1e3) / 1e3
        const isTopOpposite = rect1YPos - this.cfg.edgeLength === rect2YPos
        const isBottomOpposite = rect1YPos + this.cfg.edgeLength === rect2YPos
        const hasSameXPos = firstBCR.x === secondBCR.x
        if (
          (hasSameXPos && isTopOpposite) ||
          (hasSameXPos && isBottomOpposite)
        ) {
          return true
        }
      }
      return false
    }
  }
}
</script>

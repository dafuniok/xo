<template>
  <!-- GridSelect -->
  <v-list class="py-0 px-4">
    <v-list-item-title class="mb-4">
      Choose your Grid-System
    </v-list-item-title>
    <v-list-item-group
      v-model="selectedGrid"
      mandatory
      class="d-flex mx-4"
      color="primary"
    >
      <v-list-item v-for="(item, i) in grids" :key="i" :ripple="false">
        <v-list-item-content>
          <v-toolbar-title>
            {{ item.x + "x" + item.y }}
          </v-toolbar-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
// TODO:: Enhance usage of grid-configuration for multiple grid layouts (config-file -> state -> components)
import { mapMutations } from "vuex"

export default {
  name: "GridSelect",
  data() {
    return {
      gridConfig: {
        name: "mobile",
        edgeLength: 64,
        edgeWidth: 8,
        xCubeCount: 4,
        yCubeCount: 4,
        borderRadius: 20
      },
      grids: [
        {
          x: 4,
          y: 4,
          default: true
        },
        {
          x: 4,
          y: 6,
          default: false
        },
        {
          x: 4,
          y: 8,
          default: false
        }
      ],
      selectedGrid: 0
    }
  },
  watch: {
    selectedGrid: {
      handler: function(val) {
        this.updateGrid(val)
      }
    }
  },
  mounted() {
    this.updateGrid(this.selectedGrid)
  },
  methods: {
    ...mapMutations({
      addConfig: "grid/addConfig"
    }),
    /**
     * Updated the component grid config data and state.
     *
     * @param {Number} index The index of the selected grid.
     */
    updateGrid(index) {
      const updatedGrid = this.gridConfig
      updatedGrid.xCubeCount = this.grids[index].x
      updatedGrid.yCubeCount = this.grids[index].y
      this.addConfig({ config: updatedGrid })
    }
  }
}
</script>

<style lang="scss" scoped>
.default {
  min-height: 16px;
}
</style>

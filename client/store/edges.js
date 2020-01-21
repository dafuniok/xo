export const state = () => ({
  all: []
})

export const mutations = {
  add(state, { id, isActive, svg, isHorizontal }) {
    state.all.push({
      id,
      isActive,
      svg,
      isHorizontal,
      cubes: {}
    })
  },
  addCubesToEdge(state, { edgeId, cubes }) {
    state.all.filter(edge => {
      if (edge.id === edgeId) {
        edge.cubes = cubes
      }
    })
  },
  reset(state) {
    state.all = []
  },
  /**
   * Sets this edge to active as well as this edge occurrences inside cubes.
   *
   * @param {object} edge - Edge to be activated.
   */
  activateEdge(state, edge) {
    state.all.filter(storedEdge => {
      // activate edge
      if (storedEdge.id === edge.id) {
        storedEdge.isActive = true
      }
      // activate nested edges
      const storedCubes = storedEdge.cubes
      // only proceed with edges containing cubes
      if (
        storedCubes !== {} &&
        Object.prototype.hasOwnProperty.call(storedCubes, "first") &&
        Object.prototype.hasOwnProperty.call(storedCubes, "second")
      ) {
        // activate edge in first cube
        storedCubes.first.forEach(cubeEdge => {
          if (cubeEdge.edgeId === edge.id) {
            cubeEdge.isActive = true
          }
        })
        // activate edge in second cube
        storedCubes.second.forEach(cubeEdge => {
          if (cubeEdge.edgeId === edge.id) {
            cubeEdge.isActive = true
          }
        })
      }
    })
  },
  delete(state, { edge }) {
    state.all.splice(state.all.indexOf(edge), 1)
  }
}

export const getters = {
  all(state) {
    return state.all
  }
}

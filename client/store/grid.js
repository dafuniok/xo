export const state = () => ({
  config: {}
})

export const mutations = {
  addConfig(state, { config }) {
    state.config = Object.assign({}, config)
  }
}

export const getters = {
  config(state) {
    return state.config
  },
  maxCubeCount(state) {
    if (typeof state.config === "undefined") return
    return state.config.xCubeCount * state.config.yCubeCount
  }
}

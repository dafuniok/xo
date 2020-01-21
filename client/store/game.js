export const state = () => ({
  turn: false,
  start: false
})

export const mutations = {
  toggleTurn(state) {
    state.turn = !state.turn
  },
  resetTurn(state) {
    state.turn = false
  },
  setStart(state, { value }) {
    state.start = value
  }
}

export const getters = {
  getTurn(state) {
    return state.turn
  },
  getStart(state) {
    return state.start
  }
}

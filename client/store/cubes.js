export const state = () => ({
  all: []
})

export const mutations = {
  add(state, { cube }) {
    state.all.push({
      cube: cube
    })
  },
  delete(state, { edge }) {
    state.all.splice(state.all.indexOf(edge), 1)
  },
  reset(state) {
    state.all = []
  }
}

export const getters = {
  all(state) {
    return state.all
  },
  length(state) {
    return state.all.length
  }
}

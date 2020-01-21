export const state = () => ({
  all: []
})

export const mutations = {
  add(state, user) {
    state.all.push(user)
  },
  reset(state) {
    state.all = []
  },
  delete(state, { user }) {
    state.all.splice(state.all.indexOf(user), 1)
  },
  addScore(state, userId) {
    state.all.forEach(user => {
      if (userId !== "" && userId === user.id) {
        ++user.score
      }
    })
  }
}

export const getters = {
  all(state) {
    return state.all
  },
  getRoomId(state) {
    const user = state.all.filter(user => !user.opponent)
    if (user.length !== 1) return {}
    return user[0].room
  },
  getOpponentId(state) {
    const opponent = state.all.filter(user => user.opponent)
    if (opponent.length !== 1) return ""
    return opponent[0].id
  }
}

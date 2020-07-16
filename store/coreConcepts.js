export default {
  namespaced: true,
  // Data
  state: () => ({
    a: 123,
    b: []
  }),
  // Computed
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  mutations: {
    someMutation (state, payload) { // payload는 mutation이 실행될 때 전달 받은 값
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    // actions만 유일하게 첫번째 인자로 context가 들어오는데
    // context에는 { state, getters, commit, dispatch }가 들어있다.
    someAction1 ({ state, getters, commit, dispatch }, payload) {
      state.a = 789 // Error
      state.b.push(payload) // Error
      commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation') //mutations 를 이용하고 싶으면 commit을 사용한다.
      context.dispatch('someAction', payload) // actions를 이용하고 싶으면 dispatch를 사용한다.
    }
  }
}

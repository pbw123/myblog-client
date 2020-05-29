import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    counter: 0,
    scan:0,
    icons: [],
    night:false
  },
  mutations: {
    increment (state) {
      state.counter++
    }
  }
})

export default store

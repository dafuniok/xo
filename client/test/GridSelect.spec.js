/* eslint-disable no-undef */
import { shallowMount } from "@vue/test-utils"
import Vue from "vue"
import Vuex from "vuex"
import Vuetify from "vuetify"
import GridSelect from "@/components/GridSelect.vue"

Vue.use(Vuetify)
Vue.use(Vuex)

describe("GridSelect", () => {
  let mutations = {
    "grid/addConfig": jest.fn()
  }
  let store = new Vuex.Store({
    mutations
  })

  it("is a Vue instance", () => {
    const wrapper = shallowMount(GridSelect, { store, Vue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('call "addConfig" mutation', () => {
    shallowMount(GridSelect, { store, Vue })
    expect(mutations["grid/addConfig"]).toHaveBeenCalled()
  })
})

import StoreList from '../../src/components/StoreList'
import Vue from 'vue'
import { mount } from '@vue/test-utils'

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
}
global.navigator.geolocation = mockGeolocation

describe('StoreList', () => {
  it('생성 hook 확인', () => {
    const vm = new Vue(StoreList).$mount()
    expect(typeof StoreList.mounted).toBe('function')
  })

  it('mapContainer 확인', () => {
    const vm = mount(StoreList)
    Vue.nextTick(() => {
      expect(vm.contains('div'))
    })
  })

  it(
})
// describe('Test get info api' , () => {
//     it('위치 기반 마스크 정보 GET', () => {

//     })
// })

import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import Sortable from 'sortablejs'
import { format } from 'date-fns'
import _ from 'lodash'

export function createStore (overrideStoreConfigs) {
  function defaultStoreConfig () {
    const state = {
      siteSettings: {
        currentLanguage: 'fi'
      }
    }
    const getters = {
      currentLanguage: () => { return 'fi' },
      skillFilter: () => { return [] }
    }

    return {
      state,
      getters
    }
  }
  const mergedConfig = _.merge(defaultStoreConfig(), overrideStoreConfigs)
  return new Vuex.Store(mergedConfig)
}

function createDefaultMountingoptions (overrideStoreConfigs, overrideMountingOptions) {
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  localVue.use(Vuex)
  localVue.directive('sortable', {
    inserted: function (el, binding) {
      return new Sortable(el, binding.value || {})
    }
  })
  localVue.filter('dateFilter', value => {
    return value ? format(value, 'D.M.YYYY') : undefined
  })

  const defaultMountingOptions = {
    localVue,
    store: createStore(overrideStoreConfigs)
  }
  const mergedOptions = _.merge(defaultMountingOptions, overrideMountingOptions)
  return mergedOptions
}

export function createWrapper (component, overrideStoreConfigs, overrideMountingOptions) {
  const mountingOptions = createDefaultMountingoptions(overrideStoreConfigs, overrideMountingOptions)
  return mount(component, mountingOptions)
}

export function createShallowWrapper (component, overrideStoreConfigs, overrideMountingOptions) {
  const mountingOptions = createDefaultMountingoptions(overrideStoreConfigs, overrideMountingOptions)
  return shallowMount(component, mountingOptions)
}

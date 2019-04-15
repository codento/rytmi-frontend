import Vuex from 'vuex'
import _ from 'lodash'
import LANGUAGE_ENUM from '@/utils/constants'

export function createStore (overrideConfig) {
  function defaultStoreConfig () {
    const state = {
      siteSettings: {
        currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE
      }
    }
    return {
      state
    }
  }
  const mergedConfig = _.merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

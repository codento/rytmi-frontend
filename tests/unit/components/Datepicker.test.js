import Datepicker from '@/components/helpers/Datepicker'

import { createShallowWrapper } from './setup/setup'

const defaultMountingOptions = {
  propsData: {
    name: 'tester',
    value: null
  }
}

describe('Datepicker.test.js', () => {
  it('Test with no initial value provided', () => {
    const wrapper = createShallowWrapper(Datepicker, {}, defaultMountingOptions)
    expect(wrapper.vm.invalidFeedback).toEqual([])
  })

  it('Test with external validator', () => {
    const overrideMountingOptions = {
      ...defaultMountingOptions,
      propsData: {
        ...defaultMountingOptions.propsData,
        validator: {
          isValid: false,
          message: 'Failure'
        }
      }
    }
    const wrapper = createShallowWrapper(Datepicker, {}, overrideMountingOptions)
    expect(wrapper.vm.invalidFeedback).toEqual(['Failure'])
  })

  it('Should change to provided minimimum date if date value is set below minimum', () => {
    const overrideMountingOptions = {
      ...defaultMountingOptions,
      propsData: {
        ...defaultMountingOptions.propsData,
        value: new Date('2019-01-11'),
        minValue: new Date('2019-01-02')
      }
    }
    const wrapper = createShallowWrapper(Datepicker, {}, overrideMountingOptions)
    expect(wrapper.vm.dateString).toEqual('11.1.2019')
    // Set date below minimum and trigger change event
    wrapper.setData({ dateString: '1.12.2018' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback).toEqual([])
    expect(wrapper.vm.validFeedback.show).toBeTruthy()
    // Datestring should have changed to minimum date
    expect(wrapper.vm.dateString).toEqual('2.1.2019')
  })

  it('Should change to provided maximum date if date value is set above maximum', () => {
    const overrideMountingOptions = {
      ...defaultMountingOptions,
      propsData: {
        ...defaultMountingOptions.propsData,
        value: new Date('2019-01-11'),
        maxValue: new Date('2020-03-15')
      }
    }
    const wrapper = createShallowWrapper(Datepicker, {}, overrideMountingOptions)
    // Set date below minimum and trigger change event
    wrapper.setData({ dateString: '1.12.2025' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback).toEqual([])
    expect(wrapper.vm.validFeedback.show).toBeTruthy()
    // Datestring should have changed to minimum date
    expect(wrapper.vm.dateString).toEqual('15.3.2020')
  })

  it('Should handle invalid date input and emit false state', () => {
    const wrapper = createShallowWrapper(Datepicker, {}, defaultMountingOptions)
    // Set invalid date (invalid day)
    wrapper.setData({ dateString: '53.12.2025' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback.length).toEqual(1)
    // Set invalid date (invalid month)
    wrapper.setData({ dateString: '1.23.2025' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback.length).toEqual(1)
    // Set invalid date (invalid year)
    wrapper.setData({ dateString: '1.12.202' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback.length).toEqual(1)
    // Set invalid date (not D.M.YYYY)
    wrapper.setData({ dateString: '11122021' })
    wrapper.vm.onChange()
    expect(wrapper.vm.invalidFeedback.length).toEqual(1)

    // assert emitted states are false
    expect(wrapper.emitted('input-state')).toEqual([[ false ], [ false ], [ false ], [ false ]])
    // should not emit input value
    expect(wrapper.emitted('input')).toBeFalsy()
  })

  it.only('Should handle keyboard input and save it to datepicker', () => {
    const wrapper = createShallowWrapper(Datepicker, {}, defaultMountingOptions)
    // Set invalid date (invalid day)
    wrapper.setData({ dateString: '10.12.2015' })
    wrapper.vm.onChange()

    // assert emitted state is true
    expect(wrapper.emitted('input-state')).toEqual([[ true ]])
    // should not emit input value
    expect(wrapper.emitted('input')[0]).toEqual([new Date('2015-12-10')])
  })
})

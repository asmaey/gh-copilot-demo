import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CartIcon from '../CartIcon.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      cart: {
        open: 'Open Cart'
      }
    }
  }
})

describe('CartIcon', () => {
  it('renders cart icon', () => {
    const wrapper = mount(CartIcon, {
      props: {
        count: 0
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('does not show badge when count is 0', () => {
    const wrapper = mount(CartIcon, {
      props: {
        count: 0
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(wrapper.find('.badge').exists()).toBe(false)
  })

  it('shows badge with correct count when count > 0', () => {
    const wrapper = mount(CartIcon, {
      props: {
        count: 5
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const badge = wrapper.find('.badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
  })

  it('emits toggle event when clicked', async () => {
    const wrapper = mount(CartIcon, {
      props: {
        count: 0
      },
      global: {
        plugins: [i18n]
      }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('updates badge when count prop changes', async () => {
    const wrapper = mount(CartIcon, {
      props: {
        count: 1
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(wrapper.find('.badge').text()).toBe('1')
    
    await wrapper.setProps({ count: 3 })
    
    expect(wrapper.find('.badge').text()).toBe('3')
  })
})

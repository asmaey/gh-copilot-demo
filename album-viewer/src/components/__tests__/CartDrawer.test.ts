import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CartDrawer from '../CartDrawer.vue'
import type { Album } from '../../types/album'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        items: 'Items',
        remove: 'Remove',
        clear: 'Clear Cart',
        close: 'Close Cart'
      }
    }
  }
})

const mockAlbum1: Album = {
  id: 1,
  title: 'Test Album 1',
  artist: 'Test Artist 1',
  price: 9.99,
  image_url: 'https://example.com/image1.jpg'
}

const mockAlbum2: Album = {
  id: 2,
  title: 'Test Album 2',
  artist: 'Test Artist 2',
  price: 14.99,
  image_url: 'https://example.com/image2.jpg'
}

describe('CartDrawer', () => {
  it('renders empty state when no items and isOpen is true', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: []
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('Your cart is empty')
  })

  it('displays cart items', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: [mockAlbum1, mockAlbum2]
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    const items = wrapper.findAll('.cart-item')
    expect(items).toHaveLength(2)
    
    expect(wrapper.text()).toContain('Test Album 1')
    expect(wrapper.text()).toContain('Test Artist 1')
    expect(wrapper.text()).toContain('$9.99')
    
    expect(wrapper.text()).toContain('Test Album 2')
    expect(wrapper.text()).toContain('Test Artist 2')
    expect(wrapper.text()).toContain('$14.99')
  })

  it('shows item count in footer when items exist', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: [mockAlbum1, mockAlbum2]
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    expect(wrapper.find('.drawer-footer').exists()).toBe(true)
    expect(wrapper.find('.total-count').text()).toBe('2')
  })

  it('does not show footer when cart is empty', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: []
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    expect(wrapper.find('.drawer-footer').exists()).toBe(false)
  })

  it('emits close event when overlay is clicked', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: []
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    await wrapper.find('.drawer-overlay').trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: []
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    await wrapper.find('.close-btn').trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits remove event when remove button is clicked', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: [mockAlbum1]
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    await wrapper.find('.remove-btn').trigger('click')
    
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual([mockAlbum1.id])
  })

  it('emits clear event when clear button is clicked', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: [mockAlbum1]
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    await wrapper.find('.clear-btn').trigger('click')
    
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('does not emit close when drawer content is clicked', async () => {
    const wrapper = mount(CartDrawer, {
      props: {
        isOpen: true,
        items: []
      },
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true
        }
      }
    })
    
    await wrapper.find('.drawer').trigger('click')
    
    expect(wrapper.emitted('close')).toBeFalsy()
  })
})

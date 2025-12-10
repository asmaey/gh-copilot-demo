import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import AlbumCard from '../AlbumCard.vue'
import { useCartStore } from '../../stores/cart'
import type { Album } from '../../types/album'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      albums: {
        addToCart: 'Add to Cart',
        preview: 'Preview'
      }
    }
  }
})

const mockAlbum: Album = {
  id: 1,
  title: 'Test Album',
  artist: 'Test Artist',
  price: 9.99,
  image_url: 'https://example.com/image.jpg'
}

describe('AlbumCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders album information correctly', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(wrapper.text()).toContain('Test Album')
    expect(wrapper.text()).toContain('Test Artist')
    expect(wrapper.text()).toContain('$9.99')
  })

  it('displays album image with correct src', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
    expect(img.attributes('alt')).toBe('Test Album')
  })

  it('shows "Add to Cart" button when album not in cart', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const addButton = wrapper.find('.btn-primary')
    expect(addButton.text()).toBe('Add to Cart')
    expect(addButton.attributes('disabled')).toBeUndefined()
  })

  it('shows checkmark and disables button when album is in cart', async () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum)
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const addButton = wrapper.find('.btn-primary')
    expect(addButton.text()).toContain('✓')
    expect(addButton.attributes('disabled')).toBeDefined()
    expect(addButton.classes()).toContain('in-cart')
  })

  it('adds album to cart when "Add to Cart" is clicked', async () => {
    const cartStore = useCartStore()
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(cartStore.count).toBe(0)
    
    await wrapper.find('.btn-primary').trigger('click')
    
    expect(cartStore.count).toBe(1)
    expect(cartStore.has(mockAlbum.id)).toBe(true)
  })

  it('does not add album to cart if already in cart', async () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum)
    
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    expect(cartStore.count).toBe(1)
    
    await wrapper.find('.btn-primary').trigger('click')
    
    expect(cartStore.count).toBe(1) // Should still be 1
  })

  it('handles image error by setting placeholder', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const img = wrapper.find('img').element as HTMLImageElement
    const errorEvent = new Event('error')
    img.dispatchEvent(errorEvent)
    
    expect(img.src).toContain('via.placeholder.com')
  })

  it('renders preview button', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum
      },
      global: {
        plugins: [i18n]
      }
    })
    
    const previewButton = wrapper.find('.btn-secondary')
    expect(previewButton.exists()).toBe(true)
    expect(previewButton.text()).toBe('Preview')
  })
})

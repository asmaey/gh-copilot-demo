import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'
import type { Album } from '../../types/album'

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

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.localStorage = localStorageMock as any
  })

  it('initializes with empty items', () => {
    const cartStore = useCartStore()
    expect(cartStore.items).toEqual([])
    expect(cartStore.count).toBe(0)
  })

  it('adds an album to the cart', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0]).toEqual(mockAlbum1)
    expect(cartStore.count).toBe(1)
  })

  it('does not add duplicate albums', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    cartStore.add(mockAlbum1)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.count).toBe(1)
  })

  it('checks if album is in cart', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    
    expect(cartStore.has(mockAlbum1.id)).toBe(true)
    expect(cartStore.has(mockAlbum2.id)).toBe(false)
  })

  it('removes an album from the cart', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    cartStore.add(mockAlbum2)
    
    expect(cartStore.count).toBe(2)
    
    cartStore.remove(mockAlbum1.id)
    
    expect(cartStore.items).toHaveLength(1)
    expect(cartStore.items[0]).toEqual(mockAlbum2)
    expect(cartStore.count).toBe(1)
  })

  it('clears all items from the cart', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    cartStore.add(mockAlbum2)
    
    expect(cartStore.count).toBe(2)
    
    cartStore.clear()
    
    expect(cartStore.items).toEqual([])
    expect(cartStore.count).toBe(0)
  })

  it('saves to localStorage when adding an album', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'album-viewer:cart',
      JSON.stringify([mockAlbum1])
    )
  })

  it('saves to localStorage when removing an album', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    cartStore.remove(mockAlbum1.id)
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'album-viewer:cart',
      JSON.stringify([])
    )
  })

  it('saves to localStorage when clearing cart', () => {
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    cartStore.clear()
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'album-viewer:cart',
      JSON.stringify([])
    )
  })

  it('loads items from localStorage', () => {
    const storedData = [mockAlbum1, mockAlbum2]
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedData))
    
    const cartStore = useCartStore()
    cartStore.loadFromStorage()
    
    expect(cartStore.items).toEqual(storedData)
    expect(cartStore.count).toBe(2)
  })

  it('handles invalid localStorage data gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('invalid json')
    
    const cartStore = useCartStore()
    cartStore.loadFromStorage()
    
    expect(cartStore.items).toEqual([])
    expect(cartStore.count).toBe(0)
  })

  it('handles non-array localStorage data gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({ items: [] }))
    
    const cartStore = useCartStore()
    cartStore.loadFromStorage()
    
    expect(cartStore.items).toEqual([])
    expect(cartStore.count).toBe(0)
  })

  it('handles localStorage errors when saving', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const cartStore = useCartStore()
    cartStore.add(mockAlbum1)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save cart to localStorage:',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })

  it('handles localStorage errors when loading', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error('Storage not available')
    })
    
    const cartStore = useCartStore()
    cartStore.loadFromStorage()
    
    expect(cartStore.items).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load cart from localStorage:',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })
})

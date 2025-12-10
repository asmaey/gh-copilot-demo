import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album } from '../types/album'

const STORAGE_KEY = 'album-viewer:cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<Album[]>([])

  // Getters
  const count = computed(() => items.value.length)
  
  const has = (id: number): boolean => {
    return items.value.some(item => item.id === id)
  }

  // Actions
  const add = (album: Album): void => {
    if (!has(album.id)) {
      items.value.push(album)
      saveToStorage()
    }
  }

  const remove = (id: number): void => {
    items.value = items.value.filter(item => item.id !== id)
    saveToStorage()
  }

  const clear = (): void => {
    items.value = []
    saveToStorage()
  }

  const saveToStorage = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  const loadFromStorage = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          items.value = parsed
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      items.value = []
    }
  }

  return {
    items,
    count,
    has,
    add,
    remove,
    clear,
    loadFromStorage,
    saveToStorage
  }
})

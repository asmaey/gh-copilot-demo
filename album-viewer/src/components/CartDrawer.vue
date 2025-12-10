<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click="$emit('close')">
        <div class="drawer" @click.stop>
          <div class="drawer-header">
            <h2>{{ $t('cart.title') }}</h2>
            <button class="close-btn" @click="$emit('close')" :aria-label="$t('cart.title')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="drawer-content">
            <div v-if="items.length === 0" class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>{{ $t('cart.empty') }}</p>
            </div>

            <div v-else class="cart-items">
              <div v-for="item in items" :key="item.id" class="cart-item">
                <img :src="item.image_url" :alt="item.title" class="item-image" />
                <div class="item-info">
                  <h3>{{ item.title }}</h3>
                  <p class="item-artist">{{ item.artist }}</p>
                  <p class="item-price">${{ item.price.toFixed(2) }}</p>
                </div>
                <button 
                  class="remove-btn" 
                  @click="$emit('remove', item.id)"
                  :aria-label="$t('cart.remove')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="items.length > 0" class="drawer-footer">
            <div class="total">
              <span>{{ $t('cart.items') }}:</span>
              <span class="total-count">{{ items.length }}</span>
            </div>
            <button class="clear-btn" @click="$emit('clear')">
              {{ $t('cart.clear') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Album } from '../types/album'

interface Props {
  isOpen: boolean
  items: Album[]
}

defineProps<Props>()

defineEmits<{
  close: []
  remove: [id: number]
  clear: []
}>()
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  background: white;
  width: 100%;
  max-width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.3);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: #667eea;
  color: white;
}

.drawer-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #999;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #f0f0f0;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #333;
}

.item-artist {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.item-price {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ff4757;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.remove-btn:hover {
  background: rgba(255, 71, 87, 0.1);
}

.drawer-footer {
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.total-count {
  font-weight: bold;
  color: #667eea;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e63946;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3);
}

/* Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .drawer {
    max-width: 100%;
  }
}
</style>

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Game, CartItem } from '@/types'

type CartState = {
  items: CartItem[]
}

type CartActions = {
  addToCart: (game: Game) => void
  removeFromCart: (gameId: string) => void
  updateQuantity: (gameId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],

      // Add to cart or increment quantity
      addToCart: (game) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.game.id === game.id)
          if (existingItem) {
            // Increment quantity, respecting stock
            const newQuantity = Math.min(existingItem.quantity + 1, game.stock)
            return {
              items: state.items.map((item) =>
                item.game.id === game.id ? { ...item, quantity: newQuantity } : item
              ),
            }
          }
          // Add new item
          return { items: [...state.items, { game, quantity: 1 }] }
        }),

      // Remove from cart
      removeFromCart: (gameId) =>
        set((state) => ({
          items: state.items.filter((item) => item.game.id !== gameId),
        })),

      // Update quantity
      updateQuantity: (gameId, quantity) =>
        set((state) => {
          // Remove if quantity is 0 or less
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.game.id !== gameId),
            }
          }
          // Update quantity, respecting stock
          const item = state.items.find((item) => item.game.id === gameId)
          if (!item) return state
          
          const newQuantity = Math.min(quantity, item.game.stock)
          return {
            items: state.items.map((item) =>
              item.game.id === gameId ? { ...item, quantity: newQuantity } : item
            ),
          }
        }),
      
      // Clear cart
      clearCart: () => set({ items: [] }),

      // Selectors
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => {
          const game = item.game
          const hasDiscount = game.discount && game.discount > 0
          const currentPrice = hasDiscount ? game.price * (1 - game.discount!) : game.price
          return total + currentPrice * item.quantity
        }, 0),
    }),
    {
      name: 'game-store-cart', // name in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
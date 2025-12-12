'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ShopifyCart, CartLine } from './shopify'

interface StoreState {
  cart: ShopifyCart | null
  isCartOpen: boolean
  cartItemCount: number
  
  // Cart actions
  setCart: (cart: ShopifyCart | null) => void
  setIsCartOpen: (isOpen: boolean) => void
  updateCartItemCount: () => void
  clearCart: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: null,
      isCartOpen: false,
      cartItemCount: 0,

      setCart: (cart) => {
        set({ cart })
        get().updateCartItemCount()
      },

      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      updateCartItemCount: () => {
        const cart = get().cart
        if (!cart?.lines?.edges) {
          set({ cartItemCount: 0 })
          return
        }
        const count = cart.lines.edges.reduce((total, edge) => {
          return total + (edge.node?.quantity || 0)
        }, 0)
        set({ cartItemCount: count })
      },

      clearCart: () => set({ cart: null, cartItemCount: 0, isCartOpen: false }),
    }),
    {
      name: 'volcanic-coffee-store',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
)

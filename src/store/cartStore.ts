import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
 id: string
 variantId: string
 name: string
 variant: string
 price: number
 quantity: number
 image: string
}

interface CartStore {
 items: CartItem[]
 isOpen: boolean

 addItem: (item: Omit<CartItem, 'quantity'>) => void
 removeItem: (id: string, variantId: string) => void
 updateQuantity: (id: string, variantId: string, quantity: number) => void
 clearCart: () => void
 openCart: () => void
 closeCart: () => void

 totalItems: () => number
 subtotal: () => number
}

export const useCartStore = create<CartStore>()(
 persist(
 (set, get) => ({
 items: [],
 isOpen: false,

 addItem: (newItem) => {
 const items = get().items
 const existing = items.find(
 (i) => i.id === newItem.id && i.variantId === newItem.variantId
 )
 if (existing) {
 set({
 items: items.map((i) =>
 i.id === newItem.id && i.variantId === newItem.variantId
 ? { ...i, quantity: i.quantity + 1 }
 : i
 ),
 isOpen: true,
 })
 } else {
 set({ items: [...items, { ...newItem, quantity: 1 }], isOpen: true })
 }
 },

 removeItem: (id, variantId) => {
 set({
 items: get().items.filter(
 (i) => !(i.id === id && i.variantId === variantId)
 ),
 })
 },

 updateQuantity: (id, variantId, quantity) => {
 if (quantity <= 0) {
 get().removeItem(id, variantId)
 return
 }
 set({
 items: get().items.map((i) =>
 i.id === id && i.variantId === variantId ? { ...i, quantity } : i
 ),
 })
 },

 clearCart: () => set({ items: [] }),
 openCart: () => set({ isOpen: true }),
 closeCart: () => set({ isOpen: false }),

 totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
 subtotal: () =>
 get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
 }),
 {
 name: 'gudsampada-cart',
 partialize: (state) => ({ items: state.items }),
 }
 )
)

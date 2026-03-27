import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatVND, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../data/mockData';

// Re-export helpers for convenience
export { formatVND, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD };

// ── Reducer ───────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        ),
      };
    case 'ADD_ITEMS': {
      let newState = { ...state };
      action.payload.forEach(item => {
        const existing = newState.items.find(i => i.id === item.id);
        if (existing) {
          newState.items = newState.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
          );
        } else {
          newState.items = [...newState.items, { ...item, quantity: item.quantity || 1 }];
        }
      });
      return newState;
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LAST_ORDER':
      return { ...state, lastOrder: action.payload };
    default:
      return state;
  }
};

const initialState = () => {
  try {
    // v2 = new VNĐ schema; clear old USD cart automatically
    const saved = localStorage.getItem('db_cart_v2');
    return saved ? JSON.parse(saved) : { items: [], lastOrder: null };
  } catch {
    return { items: [], lastOrder: null };
  }
};

// ── Context ───────────────────────────────────────────────────
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, initialState);

  useEffect(() => {
    localStorage.setItem('db_cart_v2', JSON.stringify(state));
  }, [state]);

  const addItem    = (item)            => dispatch({ type: 'ADD_ITEM',        payload: item });
  const addItems   = (items)           => dispatch({ type: 'ADD_ITEMS',       payload: items });
  const removeItem = (id)              => dispatch({ type: 'REMOVE_ITEM',     payload: id });
  const updateQuantity = (id, qty)     => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } });
  const clearCart  = ()                => dispatch({ type: 'CLEAR_CART' });
  const setLastOrder = (order)         => dispatch({ type: 'SET_LAST_ORDER',  payload: order });

  // ── Computed values (all in VNĐ) ──────────────────────────
  const subtotal       = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isFreeShipping = subtotal > 0 && subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee    = subtotal > 0 ? (isFreeShipping ? 0 : SHIPPING_FEE) : 0;
  const total          = subtotal + shippingFee;
  const totalItems     = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state,
      subtotal,
      shippingFee,
      total,
      totalItems,
      isFreeShipping,
      addItem,
      addItems,
      removeItem,
      updateQuantity,
      clearCart,
      setLastOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

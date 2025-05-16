
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  ageGroup: string;
  image: string;
  variants: ProductVariant[];
}

interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, { product, variant, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: string, variantId: string) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product.id === productId && item.variant.id === variantId)
      )
    );
  };
  
  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => 
          !(item.product.id === productId && item.variant.id === variantId)
        );
      }
      
      return prevCart.map(item => {
        if (item.product.id === productId && item.variant.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  // Calculate cart count
  const cartCount = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

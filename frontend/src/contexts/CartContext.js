import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('rivo_cart');
    const savedWishlist = localStorage.getItem('rivo_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem('rivo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rivo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(
        i => i.product_id === item.product_id && 
        i.size === item.size && 
        i.color === item.color
      );
      
      if (existingItem) {
        return prev.map(i => 
          i.product_id === item.product_id && 
          i.size === item.size && 
          i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

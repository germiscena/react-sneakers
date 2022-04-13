import React from 'react';
import AppContext from '../context';

export const useCard = () => {
  const { cartItems, setCartItems } = React.useContext(AppContext);
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);

  return { cartItems, setCartItems, totalPrice };
};

import React, { createContext, useReducer } from 'react';

const initialState = {
  products: [
    { id: 1, name: 'Laptop', description: 'High-performance laptop', cost: 1200 },
    { id: 2, name: 'Smartphone', description: 'Latest model smartphone', cost: 800 },
    { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', cost: 200 },
  ],
  cart: [],
};

export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

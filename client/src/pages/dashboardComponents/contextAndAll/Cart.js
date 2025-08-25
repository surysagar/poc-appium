import React, { useContext } from 'react';
import { AppContext } from './Context';

const Cart = () => {
  const { state, dispatch } = useContext(AppContext);

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const totalCost = state.cart.reduce((acc, item) => acc + item.cost, 0);

  return (
    <div>
      <h1>Cart</h1>
      {state.cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {state.cart.map(item => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p>Cost: ${item.cost}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h2>Total Cost: ${totalCost}</h2>
    </div>
  );
};

export default Cart;

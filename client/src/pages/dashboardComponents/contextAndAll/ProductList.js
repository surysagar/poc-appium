import React, { useContext } from 'react';
import { AppContext } from './Context';

const ProductList = () => {
  const { state, dispatch } = useContext(AppContext);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {state.products.map(product => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Cost: ${product.cost}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

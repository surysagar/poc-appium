import React from 'react';
import { AppProvider } from './Context';
import ProductList from './ProductList';
import Cart from './Cart';

const ContextAll = () => {
  return (
    <AppProvider>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <ProductList />
        </div>
        <div>
          <Cart />
        </div>
      </div>
    </AppProvider>
  );
};

export default ContextAll;

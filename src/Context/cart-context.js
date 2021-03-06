import React, { useReducer } from "react";

const CartContext = React.createContext({
  addProduct: () => {},
  removeProduct: () => {},
  products: [],
  totalPrice: 0,
});

function productsReducer(state, action) {
  let updatedProducts;
  let updatedTotalPrice;
  if (action.type === "ADD") {
    const existingProductIndex = state.products.findIndex(
      (products) => action.product.productName === products.productName
    );
    updatedTotalPrice = (parseFloat(action.product.price) * parseFloat(action.product.amount)) + state.totalPrice;
    
    let existingProduct = state.products[existingProductIndex];
    if (!existingProduct) {
      // if don't have yet
      updatedProducts = state.products.concat(action.product);
    } else {
      let newAmount =
        parseInt(action.product.amount) + parseInt(existingProduct.amount);
      if (newAmount < 0) {
        newAmount = 0;
      }
      existingProduct = { ...existingProduct, amount: newAmount };
      updatedProducts = [...state.products];
      if (newAmount === 0) {
        updatedProducts.splice(existingProductIndex, 1);
      } else {
        updatedProducts[existingProductIndex] = existingProduct;
      }
    }

  }
  if(action.type === "REMOVE"){
    updatedProducts=[]
    updatedTotalPrice=0
  }

  return {
    ...state,
    totalPrice: updatedTotalPrice,
    products: updatedProducts,
  };
}

export function CartContextProvider(props) {
  const [products, dispatchProducts] = useReducer(productsReducer, {
    products: [],
    totalPrice: 0,
  });

  function addProductHandler(product) {
    dispatchProducts({ type: "ADD", product: product });
  }

  function removeProductHandler(productName) {
    dispatchProducts({ type: "REMOVE"});
  }
  const cartContext = {
    products: products.products,
    totalPrice: products.totalPrice,
    addProduct: addProductHandler,
    removeAllProducts: removeProductHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}
export default CartContext;

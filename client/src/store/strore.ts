import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productsSlice";
import productModalReducer from "./slices/productModalSlice";
import basketReducer from "./slices/basketSlice";
import orderReducer from "./slices/orderSlice";
import mobileMenuReducer from "./slices/mobileMenuSlice";

export const store = configureStore({
    reducer: {
        products: productReducer,
        productModal: productModalReducer,
        basket: basketReducer,
        order: orderReducer,
        mobileMenu: mobileMenuReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
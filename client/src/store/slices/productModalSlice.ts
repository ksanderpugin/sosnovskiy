import { createSlice } from "@reduxjs/toolkit";
import type { ProductItemType } from "../../types/ProductItemType";

type sliceStateType = {
    shown: boolean;
    product: ProductItemType | null;
}

const initialState: sliceStateType = {
    shown: false,
    product: null
}

const productModalSlice = createSlice({
    name: 'productModal',
    initialState,
    reducers: {
        showProductModal: (state, action) => {
            state.shown = true;
            state.product = action.payload;
        },
        hideProductModal: (state) => {
            state.shown = false;
        }
    }
});

export const { showProductModal, hideProductModal } = productModalSlice.actions;
export default productModalSlice.reducer;
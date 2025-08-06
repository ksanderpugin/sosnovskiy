import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ProductItemType } from "../../types/ProductItemType";

type ProductSliceStateType = {
    status: 'adle' | 'pending' | 'fulfilled' | 'error' | 'finished';
    list: ProductItemType[];
}

type FetchProductListArgs = {
    category?: string;
    limit?: string;
    offset?: string;
}

const initialState: ProductSliceStateType = {
    status: 'adle',
    list: [],
}

export const fetchProductList = createAsyncThunk<ProductItemType[], FetchProductListArgs>(
    "products/fetchProductList", 
    async ({category = 'all', limit = '12', offset = '0'}: FetchProductListArgs) => {
        const params = new URLSearchParams({
            category: category,
            limit: limit,
            offset: offset
        });
        const resp = await fetch(`${import.meta.env.VITE_BASE_URL}products?${params}`);
        const data = await resp.json();
        return data.products as ProductItemType[] || [];
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetList: (state) => {
            state.list = [];
            state.status = 'adle';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductList.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(fetchProductList.fulfilled, (state, action) => {
            if (action.payload.length == 0) {
                state.status = 'finished';
            } else {
                state.status = 'fulfilled';
                state.list = [...state.list, ...action.payload];
            }
        });
        builder.addCase(fetchProductList.rejected, (state) => {
            state.status = 'error';
        })
    }
});

export const { resetList } = productSlice.actions;
export default productSlice.reducer;
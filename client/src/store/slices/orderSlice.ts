import { createSlice } from "@reduxjs/toolkit";

// type OrderItemType = {
//     posId: number;
//     num: number;
//     price: number;
//     packType: number;
//     packWeight: number; 
// }

type DeliveryType = {
    city?: string;
    address?: string;
    shop?: string;
}

type OrderType = {
    id: number;
    number: string;
    clientName: string;
    phone: string;
    dateDelivery: string;
    deliveryType: number;
    contactType: number;
    state: number;
    basket: Record<string, number>;
    deliveryData: DeliveryType;
}

const initialState: {order: OrderType | null} = {
    order: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrder: (state, action) => {
            state.order = action.payload;
        }
    }
});

export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
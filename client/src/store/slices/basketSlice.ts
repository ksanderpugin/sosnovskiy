import { createSlice } from "@reduxjs/toolkit";

type BastetStateType = {
    list: Record<string, number>;
}

const basketListJSON = localStorage.getItem('basket');
const basketList = basketListJSON && JSON.parse(basketListJSON);

const initialState: BastetStateType = {
    list: basketList || {}
}

const saveBasket = (list: Record<string, number>) => {
    localStorage.setItem('basket', JSON.stringify(list));
}

const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            const key = `pos_${action.payload.posId}_${action.payload.packId}`;
            if (key in state.list) {
                state.list[key]++;
            } else {
                state.list[key] = 1;
            }
            saveBasket(state.list);
        },
        takeFromBasket: (state, action) => {
            const key = `pos_${action.payload.posId}_${action.payload.packId}`;
            if (key in state.list) {
                state.list[key]--;
                if (state.list[key] < 1) delete state.list[key];
            }
            saveBasket(state.list);
        },
        deleteFromBasket: (state, action) => {
            const key = `pos_${action.payload.posId}_${action.payload.packId}`;
            delete state.list[key];
            saveBasket(state.list);
        },
        clearBasket: (state) => {
            state.list = {};
            localStorage.removeItem('basket');
        }
    }
});

export const { addToBasket, takeFromBasket, deleteFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
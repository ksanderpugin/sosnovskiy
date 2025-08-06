import { createSlice } from "@reduxjs/toolkit";

const mobileMenuSlice = createSlice({
    name: 'mobile',
    initialState: {
        shown: false
    },
    reducers: {
        showMobileMenu: (state) => {
            state.shown = true;
        },
        hideMobileMenu: (state) => {
            state.shown = false;
        }
    }
});

export const { showMobileMenu, hideMobileMenu } = mobileMenuSlice.actions;
export default mobileMenuSlice.reducer;
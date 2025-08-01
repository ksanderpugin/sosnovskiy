import { createSlice } from "@reduxjs/toolkit"
import type { Lang } from "../../types/Lang";

interface IUser {
    lang: Lang
}

const initialState: IUser = {
    lang: localStorage.getItem('lang') as Lang ?? 'uk'
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.lang = action.payload;
            localStorage.setItem('lang', action.payload);
        }
    }
});

export const { setLang } = userSlice.actions;
export default userSlice.reducer;
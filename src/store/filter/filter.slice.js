import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    filterId: 1,
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilterId(state, action) {
            state.filterId = action.payload;
        }
    },
})

export const { setFilterId } = filterSlice.actions

export default filterSlice.reducer

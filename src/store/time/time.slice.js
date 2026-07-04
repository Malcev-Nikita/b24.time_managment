import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getTimeReport = createAsyncThunk(
    'time/report',
    async (period, { rejectWithValue }) => {
        const response = await fetch(`/api/b24/time?period=${period}`)

        if (!response.ok) {
            return rejectWithValue('Не удалось загрузить отчёт')
        }

        return await response.json()
    }
);

const initialState = {
    report: null,
    reportLoading: false,
    reportError: null,
}

export const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTimeReport.pending, (state) => {
                state.reportLoading = true;
                state.reportError = null;
            })
            .addCase(getTimeReport.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.report = action.payload;
            })
            .addCase(getTimeReport.rejected, (state, action) => {
                state.reportLoading = false;
                state.reportError = action.payload || action.error.message;
            });
    },
})

export default timeSlice.reducer

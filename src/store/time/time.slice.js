import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getTimeReport = createAsyncThunk(
    'time/report',
    async (period, { rejectWithValue, signal }) => {
        const response = await fetch(`/api/b24/time?period=${period}`, { signal })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
            // Сервер присылает текст ошибки Битрикса — показываем его, а не общее «не удалось»
            return rejectWithValue(data?.error || `Не удалось загрузить отчёт (${response.status})`)
        }

        return data
    }
);

const initialState = {
    report: null,
    reportLoading: false,
    reportError: null,
    // id последнего запроса: ответы прежних запросов (старый фильтр) отбрасываем
    reportRequestId: null,
    // Увеличивается по кнопке «Обновить» — ContentHeader перезагружает отчёт
    reloadKey: 0,
}

export const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        reloadReport(state) {
            state.reloadKey += 1
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTimeReport.pending, (state, action) => {
                state.reportRequestId = action.meta.requestId
                state.reportLoading = true;
                state.reportError = null;
            })
            .addCase(getTimeReport.fulfilled, (state, action) => {
                if (action.meta.requestId !== state.reportRequestId) return
                state.reportLoading = false;
                state.report = action.payload;
            })
            .addCase(getTimeReport.rejected, (state, action) => {
                // Отменённый запрос (сменили фильтр, ушли со страницы) — не ошибка
                if (action.meta.requestId !== state.reportRequestId || action.meta.aborted) return
                state.reportLoading = false;
                state.reportError = action.payload || action.error.message;
            });
    },
})

export const { reloadReport } = timeSlice.actions

export default timeSlice.reducer

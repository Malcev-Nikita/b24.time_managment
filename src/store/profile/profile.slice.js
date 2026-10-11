import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getProfileInfo = createAsyncThunk(
    'profile/info',
    async (_, { rejectWithValue }) => {
        const response = await fetch('/api/b24/profile')
        const data = await response.json().catch(() => null)

        if (!response.ok) {
            return rejectWithValue(data?.error || `Не удалось загрузить профиль (${response.status})`)
        }

        return data.result
    }
);

const initialState = {
    profileInfo: null,
    profileInfoLoading: false,
    profileInfoError: null,
}

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfileInfo.pending, (state) => {
                state.profileInfoLoading = true;
                state.profileInfoError = null;
            })
            .addCase(getProfileInfo.fulfilled, (state, action) => {
                state.profileInfoLoading = false;
                state.profileInfo = action.payload || null;
            })
            .addCase(getProfileInfo.rejected, (state, action) => {
                state.profileInfoLoading = false;
                state.profileInfoError = action.payload || action.error.message;
            });
    },
})

export default profileSlice.reducer

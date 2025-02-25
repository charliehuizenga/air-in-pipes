import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  id: string;
}

const initialState = {
  email: null,
  id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
    clearUser: (state) => {
      state.email = null;
      state.id = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// const data = JSON.parse(localStorage.getItem('auth') || '{}');

const initialState = {
  isLoggedIn: false,
  displayName: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Login: (state) => {
      state.isLoggedIn = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
    Logout: (state) => {
      state.isLoggedIn = false;

      // ❗️Viết thêm dòng này để lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          isLoggedIn: false,
          displayName: null
        }));
      }
    },
  },
});
export const { Login, Logout } = authSlice.actions;
export default authSlice.reducer;
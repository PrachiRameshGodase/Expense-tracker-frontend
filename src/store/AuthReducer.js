import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: false ,isPremium:false,darktoggle:false};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    isLogin(state, action) {
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    islogout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId")
      localStorage.removeItem("email")
      localStorage.removeItem("isPremium")
    
    },
    ispremium(state, action) {
      console.log("from authredux", action.payload);
      if (action.payload == true ) {
        state.isPremium = true;
      } else {
        state.isPremium = false;
      }
    },

    
    darkToggle(state) {
      state.darktoggle = !state.darktoggle;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

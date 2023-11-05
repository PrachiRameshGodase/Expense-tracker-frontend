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
    },
    isPremium(state,action){
      if(action.payload>1000){
        state.isPremium=true;
      }
      else{
        state.darktoggle!=state.darktoggle
      }
    }
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;

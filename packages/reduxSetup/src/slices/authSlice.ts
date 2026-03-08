import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isModalOpend: boolean;
  isAuth: boolean;
  isRequired: boolean;
  redirect: string;
  user: any
}

const initialState: AuthState = {
  isModalOpend: false,
  isAuth: false,
  user: null,
  isRequired: false,
  redirect: ''
}

export const authSlice = createSlice(
  {
    name: "auth",
    initialState,
    reducers: {
      toggleAuthModal: (state) => {
        state.isModalOpend = !state.isModalOpend
      },
      setAuthUser: (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.isAuth = true;
      },
      setRequired: (state) => {
        state.isRequired = true
      },
      setUnAuthorized: (state) => {
        state.isAuth = false
      },
      setRedirect: (state, action: PayloadAction<any>) => {
        state.redirect = action.payload
      },
      logout: (state) => {
        state.user = null;
        state.isAuth = false;
      },
    }
  }
)

export const {
  toggleAuthModal, setAuthUser, logout, setUnAuthorized, setRequired, setRedirect

} = authSlice.actions
export default authSlice.reducer

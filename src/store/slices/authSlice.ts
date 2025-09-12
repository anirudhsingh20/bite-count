import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  refreshToken: string | null
  accessToken: string | null
  isAuthenticated: boolean
  loadingType: 'google' | 'apple' | 'email' | null
  error: string | null
  _persist?: {
    rehydrated: boolean
  }
}

const initialState: AuthState = {
  user: null,
  refreshToken: null,
  accessToken: null,
  isAuthenticated: false,
  loadingType: null,    
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state, action: PayloadAction<'google' | 'apple' | 'email'>) => {
      state.loadingType = action.payload
      state.error = null
      state.refreshToken = null
      state.accessToken = null
    },
    loginSuccess: (state, action: PayloadAction<{ user: User, refreshToken: string, accessToken: string }>) => {
      state.loadingType = null
      state.isAuthenticated = true
      state.user = action.payload.user
      state.error = null
      state.refreshToken = action.payload.refreshToken
      state.accessToken = action.payload.accessToken
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loadingType = null
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
      state.refreshToken = null
      state.accessToken = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.loadingType = null
      state.error = null
      state.refreshToken = null
      state.accessToken = null
    },
    clearError: (state) => {
      state.error = null
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload
    },
    accessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    user: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      // Handle rehydration - ensure state is properly restored
      if (action.payload && typeof action.payload === 'object' && 'auth' in action.payload) {
        const persistedState = action.payload as { auth: AuthState }
        if (persistedState.auth.user && persistedState.auth.isAuthenticated) {
          state.user = persistedState.auth.user
          state.isAuthenticated = persistedState.auth.isAuthenticated
          state.refreshToken = persistedState.auth.refreshToken
          state.accessToken = persistedState.auth.accessToken
          state.loadingType = persistedState.auth.loadingType
          state.error = null
          state.refreshToken = persistedState.auth.refreshToken
          state.accessToken = persistedState.auth.accessToken
        }
      }
    })
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, clearError, refreshToken, accessToken, user } = authSlice.actions
export default authSlice.reducer

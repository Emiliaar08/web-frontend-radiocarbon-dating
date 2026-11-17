import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Researcher {
  id: number
  username: string
  full_name: string
}

interface ResearcherState {
  researcher: Researcher | null
  pending: boolean
  error: string | null
}

const initialState: ResearcherState = {
  researcher: null,
  pending: false,
  error: null,
}

const researcherSlice = createSlice({
  name: 'researcher',
  initialState,
  reducers: {
    researcherRequestStarted(state) {
      state.pending = true
      state.error = null
    },
    researcherSignedIn(_state, action: PayloadAction<Researcher>): ResearcherState {
      return { ...initialState, researcher: action.payload }
    },
    researcherSignedOut(): ResearcherState {
      return initialState
    },
    researcherRequestFailed(state, action: PayloadAction<string>) {
      state.pending = false
      state.error = action.payload
    },
    clearResearcherError(state) {
      state.error = null
    },
  },
})

export const {
  researcherRequestStarted,
  researcherSignedIn,
  researcherSignedOut,
  researcherRequestFailed,
  clearResearcherError,
} = researcherSlice.actions

export const researcherReducer = researcherSlice.reducer

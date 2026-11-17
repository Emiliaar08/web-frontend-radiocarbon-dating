import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { remainsReducer } from './remainsSlice'
import { researcherReducer } from './researcherSlice'

export const store = configureStore({
  reducer: {
    remains: remainsReducer,
    researcher: researcherReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export function selectIsPending(state: RootState) {
  const { grid, feed, draft, mutation } = state.remains
  return Boolean(grid.requestId || feed.requestId || draft.requestId || mutation.pending || state.researcher.pending)
}

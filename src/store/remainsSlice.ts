import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { getRequestMessage, isBackendUnavailable, remainsApi } from '../api/client'
import type { BodyCreateRemainsDraftApiRemainsDraftPost, PublishRemainRequest } from '../api/RemainsApi'
import { getNextRemain, toRemain } from '../modules/remains'
import type { Remain } from '../modules/remains'
import { REMAINS_MOCK } from '../modules/remains_mock'
import type { RootState } from './index'
import { researcherSignedIn, researcherSignedOut } from './researcherSlice'

const createRemainsThunk = createAsyncThunk.withTypes<{ state: RootState; rejectValue: string }>()

export const fetchRemainsGrid = createRemainsThunk(
  'remains/fetchRemainsGrid',
  async (_: void, { getState, signal, rejectWithValue }) => {
    const { remains, researcher } = getState()
    const carbonMinimum = remains.carbonMinimum
    try {
      const { data } = await remainsApi.listRemains({ carbon_min: carbonMinimum }, { signal })
      return data.map(toRemain)
    } catch (error) {
      if (!signal.aborted && !researcher.researcher && isBackendUnavailable(error)) {
        return REMAINS_MOCK.filter((remain) => (remain.carbon_14_pmc ?? 0) >= carbonMinimum)
      }
      return rejectWithValue(getRequestMessage(error, 'Не удалось загрузить останки.'))
    }
  },
)

interface RemainsFeedQuery {
  remains_id?: number
  next?: boolean
}

export const fetchRemainsFeed = createRemainsThunk(
  'remains/fetchRemainsFeed',
  async (query: RemainsFeedQuery, { getState, signal, rejectWithValue }) => {
    try {
      const { data } = await remainsApi.getRemainsFeed(query, { signal })
      return toRemain(data)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null
      if (!signal.aborted && !getState().researcher.researcher && isBackendUnavailable(error)) {
        if (query.remains_id === undefined) return REMAINS_MOCK[0]
        if (query.next) return getNextRemain(REMAINS_MOCK, query.remains_id) ?? null
        return REMAINS_MOCK.find((remain) => remain.id === query.remains_id) ?? null
      }
      return rejectWithValue(getRequestMessage(error, 'Не удалось загрузить ленту.'))
    }
  },
)

export const fetchRemainsDraft = createRemainsThunk(
  'remains/fetchRemainsDraft',
  async (_: void, { signal, rejectWithValue }) => {
    try {
      const { data } = await remainsApi.getRemainsDraft({ signal })
      return toRemain(data)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null
      return rejectWithValue(getRequestMessage(error, 'Не удалось загрузить черновик.'))
    }
  },
)

export const createRemainsDraft = createRemainsThunk(
  'remains/createRemainsDraft',
  async (fields: BodyCreateRemainsDraftApiRemainsDraftPost, { rejectWithValue }) => {
    try {
      const { data } = await remainsApi.createRemainsDraft(fields, { timeout: 90000 })
      return toRemain(data)
    } catch (error) {
      return rejectWithValue(getRequestMessage(error, 'Не удалось создать черновик. Проверьте название и файлы.'))
    }
  },
)

export const publishRemains = createRemainsThunk(
  'remains/publishRemains',
  async ({ remainId, fields }: { remainId: number; fields: PublishRemainRequest }, { rejectWithValue }) => {
    try {
      const { data } = await remainsApi.publishRemains(remainId, fields)
      return toRemain(data)
    } catch (error) {
      return rejectWithValue(getRequestMessage(error, 'Не удалось опубликовать образец. Проверьте поля.'))
    }
  },
)

export const likeRemain = createRemainsThunk(
  'remains/likeRemain',
  async ({ remainId, liked }: { remainId: number; liked: 0 | 1 }, { rejectWithValue }) => {
    try {
      const { data } = await remainsApi.setRemainLike(remainId, { liked })
      return toRemain(data)
    } catch (error) {
      return rejectWithValue(getRequestMessage(error, 'Не удалось изменить лайк.'))
    }
  },
)

export const deleteRemain = createRemainsThunk(
  'remains/deleteRemain',
  async (remainId: number, { rejectWithValue }) => {
    try {
      await remainsApi.deleteRemain(remainId)
      return remainId
    } catch (error) {
      return rejectWithValue(getRequestMessage(error, 'Не удалось удалить образец.'))
    }
  },
)

interface RemainsResult<T> {
  data: T
  requestId: string | null
  error: string | null
  loaded: boolean
}

function remainsResult<T>(data: T): RemainsResult<T> {
  return { data, requestId: null, error: null, loaded: false }
}

interface RemainsState {
  carbonValue: number
  carbonMinimum: number
  grid: RemainsResult<Remain[]>
  feed: RemainsResult<Remain | null>
  draft: RemainsResult<Remain | null>
  mutation: { pending: boolean; error: string | null }
}

const initialState: RemainsState = {
  carbonValue: 0,
  carbonMinimum: 0,
  grid: remainsResult([]),
  feed: remainsResult(null),
  draft: remainsResult(null),
  mutation: { pending: false, error: null },
}

function startRequest(result: RemainsResult<unknown>, requestId: string) {
  result.error = null
  result.requestId = requestId
}

function finishRequest<T>(result: RemainsResult<T>, requestId: string, data: T) {
  if (result.requestId !== requestId) return
  result.data = data
  result.loaded = true
  result.requestId = null
}

function failRequest(result: RemainsResult<unknown>, requestId: string, error: string | undefined) {
  if (result.requestId !== requestId) return
  result.error = error ?? null
  result.requestId = null
}

const remainsSlice = createSlice({
  name: 'remains',
  initialState,
  reducers: {
    setCarbonValue(state, action: PayloadAction<number>) {
      state.carbonValue = action.payload
    },
    applyCarbonFilter(state, action: PayloadAction<number>) {
      state.carbonValue = action.payload
      state.carbonMinimum = action.payload
    },
    clearRemainMutationError(state) {
      state.mutation.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(researcherSignedIn, (state) => ({
        ...initialState,
        carbonValue: state.carbonValue,
        carbonMinimum: state.carbonMinimum,
      }))
      .addCase(researcherSignedOut, () => initialState)
      .addCase(fetchRemainsGrid.pending, (state, { meta }) => startRequest(state.grid, meta.requestId))
      .addCase(fetchRemainsGrid.fulfilled, (state, { meta, payload }) => finishRequest(state.grid, meta.requestId, payload))
      .addCase(fetchRemainsGrid.rejected, (state, { meta, payload }) => failRequest(state.grid, meta.requestId, payload))
      .addCase(fetchRemainsFeed.pending, (state, { meta }) => startRequest(state.feed, meta.requestId))
      .addCase(fetchRemainsFeed.fulfilled, (state, { meta, payload }) => finishRequest(state.feed, meta.requestId, payload))
      .addCase(fetchRemainsFeed.rejected, (state, { meta, payload }) => failRequest(state.feed, meta.requestId, payload))
      .addCase(fetchRemainsDraft.pending, (state, { meta }) => startRequest(state.draft, meta.requestId))
      .addCase(fetchRemainsDraft.fulfilled, (state, { meta, payload }) => finishRequest(state.draft, meta.requestId, payload))
      .addCase(fetchRemainsDraft.rejected, (state, { meta, payload }) => failRequest(state.draft, meta.requestId, payload))
      .addCase(createRemainsDraft.fulfilled, (state, { payload }) => {
        state.draft = { ...remainsResult(payload), loaded: true }
      })
      .addCase(publishRemains.fulfilled, (state) => {
        state.draft = { ...remainsResult(null), loaded: true }
      })
      .addCase(likeRemain.fulfilled, (state, { payload }) => {
        if (state.feed.data?.id === payload.id) state.feed.data = payload
        state.grid.data = state.grid.data.map((remain) => remain.id === payload.id ? payload : remain)
      })
      .addCase(deleteRemain.fulfilled, (state, { payload }) => {
        state.grid.data = state.grid.data.filter((remain) => remain.id !== payload)
        if (state.feed.data?.id === payload) state.feed = remainsResult(null)
      })
      .addMatcher(isAnyOf(createRemainsDraft.pending, publishRemains.pending, likeRemain.pending, deleteRemain.pending), (state) => {
        state.mutation = { pending: true, error: null }
      })
      .addMatcher(isAnyOf(createRemainsDraft.fulfilled, publishRemains.fulfilled, likeRemain.fulfilled, deleteRemain.fulfilled), (state) => {
        state.mutation.pending = false
      })
      .addMatcher(isAnyOf(createRemainsDraft.rejected, publishRemains.rejected, likeRemain.rejected, deleteRemain.rejected), (state, { payload }) => {
        state.mutation = { pending: false, error: payload ?? null }
      })
  },
})

export const { setCarbonValue, applyCarbonFilter, clearRemainMutationError } = remainsSlice.actions
export const remainsReducer = remainsSlice.reducer

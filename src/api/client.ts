import axios, { isAxiosError } from 'axios'
import { Api } from './RemainsApi'

const axiosOptions = {
  timeout: 5000,
  withCredentials: true,
}

export const remainsApi = new Api(axiosOptions).api
export const researchersApi = axios.create(axiosOptions)

export function getRequestMessage(error: unknown, fallback: string) {
  if (!isAxiosError<{ detail?: string }>(error)) return fallback

  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (!error.response || error.response.status >= 500) return 'Веб-сервис недоступен. Попробуйте ещё раз.'
  return fallback
}

export function isBackendUnavailable(error: unknown) {
  return isAxiosError(error) && (!error.response || error.response.status >= 500)
}

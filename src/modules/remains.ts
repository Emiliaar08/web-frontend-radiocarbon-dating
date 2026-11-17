import type { RemainResponse } from '../api/RemainsApi'

export interface Remain {
  id: number
  title: string
  description: string | null
  image_url: string
  video_url: string
  analysis_time_days: number | null
  carbon_14_pmc: number | null
  likes_count: number
  is_liked: boolean
  is_mine: boolean
}

export const DEFAULT_REMAIN_IMAGE = '/remains/wood.jpg'
export const DEFAULT_REMAIN_VIDEO = '/remains/wood-video.mp4'

export function formatCarbon14(value: number) {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 3 })
}

export function formatAnalysisTime(days: number) {
  const plural = new Intl.PluralRules('ru').select(days)
  const unit = plural === 'one' ? 'день' : plural === 'few' ? 'дня' : 'дней'
  return `${days} ${unit}`
}

export function getNextRemain(remains: readonly Remain[], currentId: number) {
  return remains.find((remain) => remain.id > currentId) ?? remains[0]
}

export function toRemain(data: RemainResponse): Remain {
  return {
    ...data,
    carbon_14_pmc: data.carbon_14_pmc === null ? null : Number(data.carbon_14_pmc),
    likes_count: data.likes_count ?? 0,
    is_liked: data.is_liked === 1,
    is_mine: data.is_mine === 1,
  }
}

export function proxiedRemainMedia(url: string) {
  const source = url.trim()
  if (!/^https?:\/\//i.test(source) || !URL.canParse(source)) return source

  const { pathname, search } = new URL(source)
  if (pathname.startsWith('/static/remains/')) return pathname + search
  if (pathname.startsWith('/remains/')) return '/minio' + pathname + search
  return source
}

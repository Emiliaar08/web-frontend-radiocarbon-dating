export interface Remain {
  id: number
  title: string
  description: string
  image_url: string
  video_url: string
  analysis_time_days: number
  carbon_14_pmc: number
  likes_count: number
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

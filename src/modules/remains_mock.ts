import type { Remain } from './remains'

export const REMAINS_MOCK: readonly Remain[] = [
  {
    id: 1,
    title: 'Уголь',
    description: 'AMS-анализ древесного угля и растительных остатков из археологического слоя. Перед измерением уголь отделяют от грунта и очищают от загрязнений, которые могут повлиять на датировку.',
    image_url: 'http://localhost:9000/remains/charcoal.png',
    video_url: 'http://localhost:9000/remains/charcoal-video.mov',
    analysis_time_days: 14,
    carbon_14_pmc: 1.385,
    likes_count: 12,
  },
  {
    id: 9,
    title: 'Кости',
    description: 'Датирование костной ткани по сохранённому коллагену с контролем качества образца. Лаборатория выделяет коллаген из необожжённой кости и при достаточном количестве материала дополнительно определяет δ13C и δ15N.',
    image_url: 'http://localhost:9000/remains/bones.jpg',
    video_url: 'http://localhost:9000/remains/bones-video.mov',
    analysis_time_days: 14,
    carbon_14_pmc: 34.45,
    likes_count: 23,
  },
  {
    id: 10,
    title: 'Ракушки',
    description: 'AMS-датирование раковин и других карбонатных образцов после очистки поверхности. При интерпретации морских образцов учитывают место сбора и резервуарный эффект, а при достаточной массе дополнительно измеряют δ13C и δ18O.',
    image_url: 'http://localhost:9000/remains/shells.jpg',
    video_url: 'http://localhost:9000/remains/shells-video.mov',
    analysis_time_days: 14,
    carbon_14_pmc: 73.338,
    likes_count: 30,
  },
  {
    id: 19,
    title: 'Дерево',
    description: 'Датирование древесины по содержанию углерода-14 после очистки образца. Для исследования выбирают хорошо сохранившийся фрагмент и по возможности учитывают расположение годичных колец.',
    image_url: '',
    video_url: '',
    analysis_time_days: 12,
    carbon_14_pmc: 34.45,
    likes_count: 0,
  },
]

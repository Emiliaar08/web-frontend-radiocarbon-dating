import { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RemainsImage, RemainsVideo } from '../components/RemainsMedia'
import { formatAnalysisTime, formatCarbon14 } from '../modules/remains'
import type { Remain } from '../modules/remains'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchRemainsFeed, likeRemain } from '../store/remainsSlice'

export function RemainsFeed() {
  const { remainId } = useParams()
  const id = remainId === undefined ? undefined : Number(remainId)
  const invalidId = id !== undefined && (!Number.isSafeInteger(id) || id < 1)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const feed = useAppSelector((state) => state.remains.feed)
  const researcherId = useAppSelector((state) => state.researcher.researcher?.id)
  const openedByNext = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (invalidId) return
    if (id !== undefined && openedByNext.current === id) {
      openedByNext.current = undefined
      return
    }
    const request = dispatch(fetchRemainsFeed({ remains_id: id }))
    return () => request.abort()
  }, [dispatch, id, invalidId, researcherId])

  async function openNext(remain: Remain) {
    const result = await dispatch(fetchRemainsFeed({ remains_id: remain.id, next: true }))
    if (fetchRemainsFeed.fulfilled.match(result) && result.payload) {
      if (id !== result.payload.id) openedByNext.current = result.payload.id
      navigate('/remains/feed/' + result.payload.id)
    }
  }

  if (!invalidId && feed.error) {
    return (
      <main className="remains-feed-message" role="alert">
        <h1>Лента останков</h1>
        <p>{feed.error}</p>
        <Button onClick={() => dispatch(fetchRemainsFeed({ remains_id: id }))}>Повторить</Button>
      </main>
    )
  }
  const remain = feed.data
  if (invalidId || !remain || (id !== undefined && id !== remain.id)) {
    if (!invalidId && (!feed.loaded || feed.requestId)) return null
    return (
      <main className="remains-feed-message">
        <h1>Образец не найден</h1>
        <p>Выберите другой образец в плитке органических останков.</p>
        <Link to="/remains" className="btn btn-primary remains-back">
          <ArrowLeft size={18} aria-hidden="true" />
          К образцам
        </Link>
      </main>
    )
  }

  return (
    <RemainInFeed
      key={remain.id}
      remain={remain}
      onNext={() => void openNext(remain)}
      onLike={researcherId !== undefined
        ? () => dispatch(likeRemain({ remainId: remain.id, liked: remain.is_liked ? 0 : 1 }))
        : undefined}
    />
  )
}

interface RemainInFeedProps {
  remain: Remain
  onNext: () => void
  onLike?: () => void
}

function RemainInFeed({ remain, onNext, onLike }: RemainInFeedProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <main className="remains-feed-page">
      <RemainsVideo videoUrl={remain.video_url} title={remain.title} />
      <div className="remains-feed-shade" />
      <div className="remains-feed-copy">
        <RemainsImage imageUrl={remain.image_url} title={remain.title} className="remains-feed-photo" />
        <h1>{remain.title}</h1>
        {remain.description && (
          <>
            <p id="remains-description" className={expanded ? 'remains-description is-expanded' : 'remains-description'}>
              {remain.description}
            </p>
            <Button
              variant="link"
              className="remains-expand"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="remains-description"
            >
              {expanded ? 'Свернуть' : 'Развернуть'}
            </Button>
          </>
        )}
      </div>
      <aside className="remains-parameters" aria-label="Параметры образца">
        {onLike ? (
          <button
            type="button"
            className="remains-feed-likes remains-like-button"
            aria-label="Лайк"
            aria-pressed={remain.is_liked}
            title={remain.is_liked ? 'Убрать лайк' : 'Поставить лайк'}
            onClick={onLike}
          >
            <Heart size={29} strokeWidth={2.5} fill={remain.is_liked ? 'currentColor' : 'none'} aria-hidden="true" />
            <span>{remain.likes_count}</span>
          </button>
        ) : (
          <div className="remains-feed-likes" aria-label={'Лайков: ' + remain.likes_count}>
            <Heart size={29} strokeWidth={2.5} aria-hidden="true" />
            <span>{remain.likes_count}</span>
          </div>
        )}
        <div className="remains-fact">
          <img src="/remains/flask.png" alt="" />
          <strong>{remain.carbon_14_pmc === null ? '—' : formatCarbon14(remain.carbon_14_pmc) + ' pMC'}</strong>
          <span>Содержание C-14</span>
        </div>
        <div className="remains-fact">
          <img src="/remains/watch.png" alt="" />
          <strong>{remain.analysis_time_days === null ? '—' : formatAnalysisTime(remain.analysis_time_days)}</strong>
          <span>Время анализа</span>
        </div>
        <button type="button" className="remains-next" onClick={onNext} aria-label="Следующий образец" title="Следующий">
          <ArrowRight size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </aside>
    </main>
  )
}

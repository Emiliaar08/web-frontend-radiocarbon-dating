import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { ArrowRight, Heart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { RemainsImage, RemainsVideo } from '../components/RemainsMedia'
import { formatAnalysisTime, formatCarbon14, getNextRemain } from '../modules/remains'
import type { Remain } from '../modules/remains'
import { RemainsNotFound } from './RemainsNotFound'

interface RemainsFeedProps {
  remains: readonly Remain[]
  filteredRemains: readonly Remain[]
}

export function RemainsFeed({ remains, filteredRemains }: RemainsFeedProps) {
  const { remainId } = useParams()
  const remain = remains.find((item) => String(item.id) === remainId)

  if (!remain) {
    return <RemainsNotFound />
  }

  const feedRemains = filteredRemains.some((item) => item.id === remain.id) ? filteredRemains : remains
  const nextRemain = getNextRemain(feedRemains, remain.id)

  return <RemainInFeed key={remain.id} remain={remain} nextRemain={nextRemain} />
}

function RemainInFeed({ remain, nextRemain }: { remain: Remain; nextRemain: Remain | undefined }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <main className="remains-feed-page">
      <RemainsVideo videoUrl={remain.video_url} title={remain.title} />
      <div className="remains-feed-shade" />
      <div className="remains-feed-copy">
        <RemainsImage imageUrl={remain.image_url} title={remain.title} className="remains-feed-photo" />
        <h1>{remain.title}</h1>
        <p id="remains-description" className={`remains-description${expanded ? ' is-expanded' : ''}`}>
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
      </div>
      <aside className="remains-parameters" aria-label="Параметры образца">
        <div className="remains-feed-likes" aria-label={`Лайков: ${remain.likes_count}`}>
          <Heart size={29} strokeWidth={2.5} aria-hidden="true" />
          <span>{remain.likes_count}</span>
        </div>
        <div className="remains-fact">
          <img src="/remains/flask.png" alt="" />
          <strong>{formatCarbon14(remain.carbon_14_pmc)} pMC</strong>
          <span>Содержание C-14</span>
        </div>
        <div className="remains-fact">
          <img src="/remains/watch.png" alt="" />
          <strong>{formatAnalysisTime(remain.analysis_time_days)}</strong>
          <span>Время анализа</span>
        </div>
        {nextRemain && (
          <Link className="remains-next" to={`/remains/feed/${nextRemain.id}`} aria-label="Следующий образец" title="Следующий">
            <ArrowRight size={24} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
      </aside>
    </main>
  )
}

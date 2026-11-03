import Card from 'react-bootstrap/Card'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatAnalysisTime, formatCarbon14 } from '../modules/remains'
import type { Remain } from '../modules/remains'
import { RemainsImage } from './RemainsMedia'

interface RemainsCardProps {
  remain: Remain
}

export function RemainsCard({ remain }: RemainsCardProps) {
  return (
    <Card as="article" className="remains-card">
      <Link to={`/remains/feed/${remain.id}`} className="remains-card-link" aria-label={`Открыть образец «${remain.title}»`}>
        <div className="remains-card-picture">
          <RemainsImage imageUrl={remain.image_url} title={remain.title} className="remains-card-image" />
          <span className="remains-card-likes" aria-label={`Лайков: ${remain.likes_count}`}>
            <Heart size={15} aria-hidden="true" />
            {remain.likes_count}
          </span>
        </div>
        <Card.Body>
          <Card.Title as="h2">{remain.title}</Card.Title>
          <Card.Text as="div">
            <p>C-14: {formatCarbon14(remain.carbon_14_pmc)} pMC</p>
            <p>Анализ: {formatAnalysisTime(remain.analysis_time_days)}</p>
          </Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
}

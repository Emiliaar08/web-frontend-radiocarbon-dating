import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RemainsNotFound() {
  return (
    <main className="remains-not-found">
      <span className="remains-error-code">404</span>
      <h1>Образец не найден</h1>
      <p>Проверьте адрес или выберите образец в плитке органических останков.</p>
      <Link to="/remains" className="btn btn-primary remains-back">
        <ArrowLeft size={18} aria-hidden="true" />
        К образцам
      </Link>
    </main>
  )
}

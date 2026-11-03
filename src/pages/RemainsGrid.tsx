import { RemainsCard } from '../components/RemainsCard'
import { RemainsFilter } from '../components/RemainsFilter'
import type { Remain } from '../modules/remains'

interface RemainsGridProps {
  remains: readonly Remain[]
  carbonMinimum: number
  onCarbonChange: (carbonMinimum: number) => void
}

export function RemainsGrid({ remains, carbonMinimum, onCarbonChange }: RemainsGridProps) {
  return (
    <main className="remains-grid-page">
      <header className="remains-heading">
        <h1>Типы органических<br />останков</h1>
      </header>
      <RemainsFilter carbonMinimum={carbonMinimum} onApply={onCarbonChange} />
      <div className="visually-hidden" aria-live="polite">
        <span>{remains.length ? `Найдено образцов: ${remains.length}` : 'Образцы не найдены'}</span>
      </div>
      <div className="remains-grid">
        {remains.map((remain) => <RemainsCard key={remain.id} remain={remain} />)}
        {remains.length === 0 && (
          <div className="remains-empty">
            <h2>Нет подходящих образцов</h2>
            <p>Уменьшите содержание C-14 или сбросьте фильтр.</p>
          </div>
        )}
      </div>
    </main>
  )
}

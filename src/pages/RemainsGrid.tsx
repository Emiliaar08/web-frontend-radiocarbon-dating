import { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { RemainsCard } from '../components/RemainsCard'
import { RemainsFilter } from '../components/RemainsFilter'
import { useAppDispatch, useAppSelector } from '../store'
import { applyCarbonFilter, deleteRemain, fetchRemainsGrid, setCarbonValue } from '../store/remainsSlice'

export function RemainsGrid() {
  const dispatch = useAppDispatch()
  const researcher = useAppSelector((state) => state.researcher.researcher)
  const { grid, carbonMinimum, carbonValue } = useAppSelector((state) => state.remains)

  useEffect(() => {
    const request = dispatch(fetchRemainsGrid())
    return () => request.abort()
  }, [dispatch, researcher])

  function applyFilter(value: number) {
    dispatch(applyCarbonFilter(value))
    void dispatch(fetchRemainsGrid())
  }

  return (
    <main className="remains-grid-page">
      <header className="remains-heading">
        <h1>Типы органических<br />останков</h1>
      </header>
      <RemainsFilter
        carbonMinimum={carbonMinimum}
        carbonValue={carbonValue}
        onChange={(value) => dispatch(setCarbonValue(value))}
        onApply={applyFilter}
      />
      <div className="remains-grid">
        {grid.error ? (
          <div className="remains-empty" role="alert">
            <p>{grid.error}</p>
            <Button onClick={() => dispatch(fetchRemainsGrid())}>Повторить</Button>
          </div>
        ) : (
          <>
            {grid.loaded && (
              <span className="visually-hidden" aria-live="polite">Найдено образцов: {grid.data.length}</span>
            )}
            {grid.data.map((remain) => (
              <RemainsCard
                key={remain.id}
                remain={remain}
                onDelete={researcher && remain.is_mine ? () => void dispatch(deleteRemain(remain.id)) : undefined}
              />
            ))}
            {grid.loaded && grid.data.length === 0 && (
              <div className="remains-empty">
                <h2>Нет подходящих образцов</h2>
                <p>Уменьшите содержание C-14 или сбросьте фильтр.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

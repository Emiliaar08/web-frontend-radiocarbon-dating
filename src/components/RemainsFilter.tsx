import { useState } from 'react'
import type { FormEvent } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Search } from 'lucide-react'
import { formatCarbon14 } from '../modules/remains'

interface RemainsFilterProps {
  carbonMinimum: number
  onApply: (carbonMinimum: number) => void
}

export function RemainsFilter({ carbonMinimum, onApply }: RemainsFilterProps) {
  const [carbonValue, setCarbonValue] = useState(carbonMinimum)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply(carbonValue)
  }

  function handleReset() {
    setCarbonValue(0)
    onApply(0)
  }

  return (
    <Form className="remains-filter" onSubmit={handleSubmit} onReset={handleReset}>
      <Form.Label htmlFor="remains-carbon">Содержание C-14, pMC</Form.Label>
      <div className="remains-filter-controls">
        <div className="remains-range-field">
          <Form.Range
            id="remains-carbon"
            min={0}
            max={200}
            step={0.1}
            value={carbonValue}
            onChange={(event) => setCarbonValue(Number(event.target.value))}
            aria-describedby="remains-carbon-value"
            aria-valuetext={`От ${formatCarbon14(carbonValue)} pMC`}
          />
          <div className="remains-range-scale" aria-hidden="true">
            <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span>
          </div>
        </div>
        <Button type="submit" className="remains-find" aria-label="Найти останки" title="Найти">
          <Search size={19} strokeWidth={2} aria-hidden="true" />
        </Button>
      </div>
      <div className="remains-filter-caption">
        <output id="remains-carbon-value" htmlFor="remains-carbon">От {formatCarbon14(carbonValue)} pMC</output>
        {(carbonValue !== 0 || carbonMinimum !== 0) && (
          <Button type="reset" variant="link" className="remains-reset">
            Сбросить
          </Button>
        )}
      </div>
    </Form>
  )
}

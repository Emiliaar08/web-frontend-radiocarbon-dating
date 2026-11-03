import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RemainsNavbar } from './components/RemainsNavbar'
import { REMAINS_MOCK } from './modules/remains_mock'
import { RemainsFeed } from './pages/RemainsFeed'
import { RemainsGrid } from './pages/RemainsGrid'
import { RemainsNotFound } from './pages/RemainsNotFound'

function App() {
  const [carbonMinimum, setCarbonMinimum] = useState(0)
  const { pathname } = useLocation()
  const filteredRemains = REMAINS_MOCK.filter((remain) => remain.carbon_14_pmc >= carbonMinimum)
  const firstRemain = filteredRemains[0] ?? REMAINS_MOCK[0]
  const isFeed = pathname.startsWith('/remains/feed/') && REMAINS_MOCK.some((remain) => pathname === `/remains/feed/${remain.id}`)

  useEffect(() => {
    const remain = REMAINS_MOCK.find((item) => pathname === `/remains/feed/${item.id}`)
    const title = remain ? remain.title : pathname === '/remains' ? 'Типы органических останков' : 'Образец не найден'
    document.title = `${title} — Радиоуглеродное датирование`
  }, [pathname])

  return (
    <div className={`remains-app${isFeed ? ' is-feed' : ''}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/remains" replace />} />
        <Route
          path="/remains"
          element={<RemainsGrid remains={filteredRemains} carbonMinimum={carbonMinimum} onCarbonChange={setCarbonMinimum} />}
        />
        <Route path="/remains/feed" element={<Navigate to={`/remains/feed/${firstRemain.id}`} replace />} />
        <Route path="/remains/feed/:remainId" element={<RemainsFeed remains={REMAINS_MOCK} filteredRemains={filteredRemains} />} />
        <Route path="*" element={<RemainsNotFound />} />
      </Routes>
      <RemainsNavbar />
    </div>
  )
}

export default App

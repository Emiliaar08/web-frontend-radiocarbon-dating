import { useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RemainsNavbar } from './components/RemainsNavbar'
import { RemainsDraft } from './pages/RemainsDraft'
import { RemainsFeed } from './pages/RemainsFeed'
import { RemainsGrid } from './pages/RemainsGrid'
import { ResearcherSignIn } from './pages/ResearcherSignIn'
import { selectIsPending, useAppDispatch, useAppSelector } from './store'
import { clearRemainMutationError } from './store/remainsSlice'
import { clearResearcherError } from './store/researcherSlice'

function App() {
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const { researcher, error: researcherError } = useAppSelector((state) => state.researcher)
  const { feed, mutation } = useAppSelector((state) => state.remains)
  const pending = useAppSelector(selectIsPending)
  const isFeed = pathname === '/remains/feed' || pathname.startsWith('/remains/feed/')
  const error = mutation.error ?? (pathname === '/researchers/sign-in' ? null : researcherError)

  useEffect(() => {
    const title = isFeed ? feed.data?.title ?? 'Лента останков'
      : pathname === '/remains/draft' ? 'Добавление образца'
      : pathname === '/researchers/sign-in' ? 'Вход исследователя'
      : 'Типы органических останков'
    document.title = title + ' — Радиоуглеродное датирование'
  }, [pathname, isFeed, feed.data?.title])

  function closeError() {
    if (mutation.error) dispatch(clearRemainMutationError())
    else dispatch(clearResearcherError())
  }

  return (
    <div className={isFeed && feed.data && !feed.error ? 'remains-app is-feed' : 'remains-app'} aria-busy={pending}>
      <div className="remains-content" inert={pending}>
        <Routes>
          <Route path="/remains" element={<RemainsGrid />} />
          <Route path="/remains/feed/:remainId?" element={<RemainsFeed />} />
          <Route path="/remains/draft" element={researcher ? <RemainsDraft /> : <Navigate to="/researchers/sign-in" replace />} />
          <Route path="/researchers/sign-in" element={researcher ? <Navigate to="/remains" replace /> : <ResearcherSignIn />} />
          <Route path="*" element={<Navigate to="/remains" replace />} />
        </Routes>
        <RemainsNavbar />
        {error && <Alert className="remains-request-error" variant="danger" dismissible onClose={closeError}>{error}</Alert>}
      </div>
      {pending && (
        <div className="remains-loading" role="status">
          <Spinner animation="border" variant="primary" aria-hidden="true" />
          <span className="visually-hidden">Выполняется запрос</span>
        </div>
      )}
    </div>
  )
}

export default App

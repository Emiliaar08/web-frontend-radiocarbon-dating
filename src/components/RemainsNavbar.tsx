import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getRequestMessage, researchersApi } from '../api/client'
import { useAppDispatch, useAppSelector } from '../store'
import { researcherRequestFailed, researcherRequestStarted, researcherSignedOut } from '../store/researcherSlice'

export function RemainsNavbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const researcher = useAppSelector((state) => state.researcher.researcher)
  const activeIndex = pathname.startsWith('/remains/feed') ? 0
    : pathname === '/remains/draft' ? 1
    : pathname === '/researchers/sign-in' ? 3
    : 2

  async function signOut() {
    dispatch(researcherRequestStarted())
    try {
      await researchersApi.post('/api/researchers/logout')
      dispatch(researcherSignedOut())
      navigate('/remains', { replace: true })
    } catch (error) {
      dispatch(researcherRequestFailed(getRequestMessage(error, 'Не удалось выйти.')))
    }
  }

  return (
    <Navbar className="remains-navbar" aria-label="Основная навигация">
      <Nav className={'remains-tabs remains-tabs-' + activeIndex}>
        <Nav.Link as={NavLink} to="/remains/feed">Лента</Nav.Link>
        {researcher
          ? <Nav.Link as={NavLink} to="/remains/draft">Добавление</Nav.Link>
          : <Nav.Link as="button" type="button" disabled title="Войдите, чтобы добавить образец">Добавление</Nav.Link>}
        <Nav.Link as={NavLink} to="/remains" end>Плитка</Nav.Link>
        {researcher
          ? <Nav.Link as="button" type="button" title={'Выйти из аккаунта ' + researcher.username} onClick={() => void signOut()}>Выход</Nav.Link>
          : <Nav.Link as={NavLink} to="/researchers/sign-in">Вход</Nav.Link>}
      </Nav>
    </Navbar>
  )
}

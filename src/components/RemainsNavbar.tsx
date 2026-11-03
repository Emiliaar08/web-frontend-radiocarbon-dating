import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink, useLocation } from 'react-router-dom'

export function RemainsNavbar() {
  const { pathname } = useLocation()
  const activeIndex = pathname.startsWith('/remains/feed') ? 0 : 2

  return (
    <Navbar className="remains-navbar" aria-label="Основная навигация">
      <Nav className={`remains-tabs remains-tabs-${activeIndex}`}>
        <Nav.Link as={NavLink} to="/remains/feed">Лента</Nav.Link>
        <Nav.Link as="button" type="button" disabled title="Добавление недоступно гостю">Добавление</Nav.Link>
        <Nav.Link as={NavLink} to="/remains" end>Плитка</Nav.Link>
        <Nav.Link as="button" type="button" disabled title="Вход будет доступен в следующей лабораторной">Вход</Nav.Link>
      </Nav>
    </Navbar>
  )
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { getRequestMessage, researchersApi } from '../api/client'
import type { Researcher } from '../store/researcherSlice'
import { useAppDispatch, useAppSelector } from '../store'
import {
  researcherRequestFailed,
  researcherRequestStarted,
  researcherSignedIn,
} from '../store/researcherSlice'

export function ResearcherSignIn() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const error = useAppSelector((state) => state.researcher.error)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submitResearcher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(researcherRequestStarted())
    try {
      const { data } = await researchersApi.post<Researcher>('/api/researchers/auth', {
        username: username.trim(),
        password,
      })
      dispatch(researcherSignedIn({ id: data.id, username: data.username, full_name: data.full_name }))
      navigate('/remains', { replace: true })
    } catch (error) {
      dispatch(researcherRequestFailed(getRequestMessage(error, 'Проверьте данные исследователя.')))
    }
  }

  return (
    <main className="remains-form-page">
      <h1>Вход исследователя</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="remains-entry-form" onSubmit={(event) => void submitResearcher(event)}>
        <Form.Group controlId="researcher-username">
          <Form.Label>Логин</Form.Label>
          <Form.Control required minLength={3} maxLength={80} autoComplete="username" value={username}
            onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>
        <Form.Group controlId="researcher-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" required minLength={8} maxLength={128}
            autoComplete="current-password" value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>
        <Button type="submit" className="remains-submit">Войти</Button>
      </Form>
    </main>
  )
}

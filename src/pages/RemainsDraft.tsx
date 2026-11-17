import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import { RemainsImage, RemainsVideo } from '../components/RemainsMedia'
import type { Remain } from '../modules/remains'
import { useAppDispatch, useAppSelector } from '../store'
import { createRemainsDraft, fetchRemainsDraft, publishRemains } from '../store/remainsSlice'

export function RemainsDraft() {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.remains.draft)

  useEffect(() => {
    const request = dispatch(fetchRemainsDraft())
    return () => request.abort()
  }, [dispatch])

  return (
    <main>
      <header className="remains-heading">
        <h1>Новый тип<br />останков</h1>
      </header>
      {draft.error && (
        <Alert className="remains-request-error" variant="danger">
          <p>{draft.error}</p>
          <Button onClick={() => dispatch(fetchRemainsDraft())}>Повторить</Button>
        </Alert>
      )}
      {draft.loaded && !draft.error && (draft.data
        ? <RemainsPublication key={draft.data.id} draft={draft.data} />
        : <RemainsDraftForm />)}
    </main>
  )
}

interface RemainsFilePickerProps {
  id: string
  label: string
  accept: string
  onSelect: (file: File | null) => void
}

function RemainsFilePicker({ id, label, accept, onSelect }: RemainsFilePickerProps) {
  return (
    <div className="remains-add-picker">
      <input
        className="visually-hidden"
        id={id}
        type="file"
        accept={accept}
        aria-label={label}
        onChange={(event) => onSelect(event.currentTarget.files?.[0] ?? null)}
      />
      <label className="remains-add-folder" htmlFor={id} title={label}>
        <img src="/remains/folder.webp" alt="" />
      </label>
    </div>
  )
}

interface RemainsDraftMediaProps {
  title?: string
  imageUrl?: string
  videoUrl?: string
  onImageSelect?: RemainsFilePickerProps['onSelect']
  onVideoSelect?: RemainsFilePickerProps['onSelect']
}

function RemainsDraftMedia({
  title = 'Образец древесины',
  imageUrl = '',
  videoUrl = '',
  onImageSelect,
  onVideoSelect,
}: RemainsDraftMediaProps) {
  return (
    <fieldset>
      <legend className="visually-hidden">Фото и видео останков</legend>
      <div className="remains-add-media-field">
        <span className="remains-add-caption">Изображение</span>
        <RemainsImage imageUrl={imageUrl} title={title} className="remains-add-photo" />
        {onImageSelect && (
          <RemainsFilePicker id="remain-image" label="Выбрать фото" accept=".jpg,.jpeg,.png,.webp,.gif" onSelect={onImageSelect} />
        )}
      </div>
      <div className="remains-add-media-field">
        <span className="remains-add-caption">Видео</span>
        <RemainsVideo videoUrl={videoUrl} title={title} controls className="remains-add-video" />
        {onVideoSelect && (
          <RemainsFilePicker id="remain-video" label="Выбрать видео" accept=".mp4,.mov,.webm,.m4v" onSelect={onVideoSelect} />
        )}
      </div>
    </fieldset>
  )
}

function useRemainFilePreview(file: File | null) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setUrl('')
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return url
}

function RemainsDraftForm() {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const imageUrl = useRemainFilePreview(image)
  const videoUrl = useRemainFilePreview(video)

  function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !image || !video) return
    void dispatch(createRemainsDraft({ title: title.trim(), image_file: image, video_file: video }))
  }

  return (
    <Form className="remains-add-form" onSubmit={submitDraft} autoComplete="off">
      <div className="remains-add-scroll">
        <RemainsDraftMedia
          title={title.trim() || undefined}
          imageUrl={imageUrl}
          videoUrl={videoUrl}
          onImageSelect={setImage}
          onVideoSelect={setVideo}
        />
        <fieldset className="remains-add-fields">
          <legend className="visually-hidden">Параметры останков</legend>
          <Form.Group controlId="remain-title">
            <Form.Label>Название останков</Form.Label>
            <Form.Control required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />
          </Form.Group>
        </fieldset>
      </div>
      <Button type="submit" className="remains-add-submit" disabled={!title.trim() || !image || !video}>
        Далее
      </Button>
    </Form>
  )
}

function RemainsPublication({ draft }: { draft: Remain }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [description, setDescription] = useState(draft.description ?? '')
  const [analysisDays, setAnalysisDays] = useState(String(draft.analysis_time_days ?? ''))
  const [carbon, setCarbon] = useState(String(draft.carbon_14_pmc ?? ''))

  async function submitPublication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (description.trim().length < 2) return
    const result = await dispatch(publishRemains({
      remainId: draft.id,
      fields: {
        description: description.trim(),
        analysis_time_days: Number(analysisDays),
        carbon_14_pmc: carbon,
      },
    }))
    if (publishRemains.fulfilled.match(result)) navigate('/remains/feed/' + result.payload.id)
  }

  return (
    <Form className="remains-add-form" onSubmit={(event) => void submitPublication(event)} autoComplete="off">
      <div className="remains-add-scroll">
        <RemainsDraftMedia title={draft.title} imageUrl={draft.image_url} videoUrl={draft.video_url} />
        <fieldset className="remains-add-fields">
          <legend className="visually-hidden">Описание и параметры останков</legend>
          <Form.Group controlId="remain-draft-title">
            <Form.Label>Название останков</Form.Label>
            <Form.Control value={draft.title} readOnly />
          </Form.Group>
          <Form.Group controlId="remain-description">
            <Form.Label>Описание</Form.Label>
            <Form.Control as="textarea" rows={3} required minLength={2} maxLength={2000} readOnly={Boolean(draft.description)}
              value={description} onChange={(event) => setDescription(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="remain-analysis-time">
            <Form.Label>Время анализа, рабочих дней</Form.Label>
            <Form.Control type="number" required min={1} max={36500} readOnly={draft.analysis_time_days !== null}
              value={analysisDays} onChange={(event) => setAnalysisDays(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="remain-carbon-content">
            <Form.Label>Содержание C‑14, pMC</Form.Label>
            <Form.Control type="number" required min={0} max={200} step={0.001} readOnly={draft.carbon_14_pmc !== null}
              value={carbon} onChange={(event) => setCarbon(event.target.value)} />
          </Form.Group>
        </fieldset>
      </div>
      <Button type="submit" className="remains-add-submit" disabled={description.trim().length < 2 || !analysisDays || !carbon}>
        Опубликовать
      </Button>
    </Form>
  )
}

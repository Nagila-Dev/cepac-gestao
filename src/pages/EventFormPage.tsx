import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { CITIES, EVENT_STATUSES, isCity, isEventStatus } from '../constants.ts'
import { useData } from '../context/DataContext.tsx'
import { sortByName } from '../lib/helpers.ts'
import type { City, CulturalEvent, EventStatus, Person } from '../types.ts'

type FormState = {
  name: string
  date: string
  time: string
  city: City | ''
  venue: string
  eventLeadId: string
  wardrobeLeadId: string
  scriptLeadId: string
  musicLeadId: string
  notes: string
  status: EventStatus
}

function blankForm(): FormState {
  return {
    name: '',
    date: '',
    time: '',
    city: '',
    venue: '',
    eventLeadId: '',
    wardrobeLeadId: '',
    scriptLeadId: '',
    musicLeadId: '',
    notes: '',
    status: 'Planejado',
  }
}

function fromEvent(event: CulturalEvent): FormState {
  return {
    name: event.name,
    date: event.date,
    time: event.time,
    city: event.city,
    venue: event.venue,
    eventLeadId: event.eventLeadId,
    wardrobeLeadId: event.wardrobeLeadId,
    scriptLeadId: event.scriptLeadId,
    musicLeadId: event.musicLeadId,
    notes: event.notes,
    status: event.status,
  }
}

function PersonField({
  label,
  value,
  people,
  onChange,
}: {
  label: string
  value: string
  people: Person[]
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Não definido</option>
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export function EventFormRoute() {
  const { id } = useParams()
  return <EventFormPage key={id ?? 'novo'} />
}

function EventFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, people, saveEvent } = useData()
  const existing = id ? events.find((item) => item.id === id) : undefined
  const [form, setForm] = useState<FormState>(() => (existing ? fromEvent(existing) : blankForm()))
  const [error, setError] = useState('')
  const peopleByName = sortByName(people)

  if (id && !existing) {
    return (
      <div className="page">
        <h1>Evento não encontrado</h1>
        <Link to="/agenda" className="back-link">
          Voltar para a agenda
        </Link>
      </div>
    )
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim() || !form.date || !form.time || !form.city || !form.venue.trim()) {
      setError('Preencha nome, data, horário, cidade e local.')
      return
    }
    if (!isCity(form.city) || !isEventStatus(form.status)) {
      setError('Selecione a cidade e o status.')
      return
    }

    const savedId = saveEvent({
      id,
      name: form.name,
      date: form.date,
      time: form.time,
      city: form.city,
      venue: form.venue,
      eventLeadId: form.eventLeadId,
      wardrobeLeadId: form.wardrobeLeadId,
      scriptLeadId: form.scriptLeadId,
      musicLeadId: form.musicLeadId,
      notes: form.notes,
      status: form.status,
    })
    navigate(`/eventos/${savedId}`)
  }

  return (
    <div className="page">
      <PageHeader eyebrow="Eventos" title={id ? 'Editar evento' : 'Novo evento'} />
      <form className="card form-grid" onSubmit={handleSubmit} noValidate>
        {error ? <p className="form-error field-span">{error}</p> : null}
        <label className="field field-span">
          <span>Nome do evento</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} maxLength={120} />
        </label>
        <label className="field">
          <span>Data</span>
          <input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
        </label>
        <label className="field">
          <span>Horário</span>
          <input type="time" value={form.time} onChange={(event) => update('time', event.target.value)} />
        </label>
        <label className="field">
          <span>Cidade</span>
          <select
            value={form.city}
            onChange={(event) => update('city', isCity(event.target.value) ? event.target.value : '')}
          >
            <option value="">Selecione</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => {
              if (isEventStatus(event.target.value)) update('status', event.target.value)
            }}
          >
            {EVENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="field field-span">
          <span>Local</span>
          <input value={form.venue} onChange={(event) => update('venue', event.target.value)} maxLength={120} />
        </label>
        <PersonField
          label="Responsável pelo evento"
          value={form.eventLeadId}
          people={peopleByName}
          onChange={(value) => update('eventLeadId', value)}
        />
        <PersonField
          label="Responsável pelo vestuário"
          value={form.wardrobeLeadId}
          people={peopleByName}
          onChange={(value) => update('wardrobeLeadId', value)}
        />
        <PersonField
          label="Responsável pelo roteiro"
          value={form.scriptLeadId}
          people={peopleByName}
          onChange={(value) => update('scriptLeadId', value)}
        />
        <PersonField
          label="Responsável pela música"
          value={form.musicLeadId}
          people={peopleByName}
          onChange={(value) => update('musicLeadId', value)}
        />
        <label className="field field-span">
          <span>Observações</span>
          <textarea
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            rows={4}
            maxLength={500}
          />
        </label>
        <div className="form-actions field-span">
          <Link to={id ? `/eventos/${id}` : '/agenda'} className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}

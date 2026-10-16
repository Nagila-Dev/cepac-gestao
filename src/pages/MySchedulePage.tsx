import { Link, Navigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { useData } from '../context/DataContext.tsx'
import { compareEvents, formatDate } from '../lib/helpers.ts'

export function MySchedulePage() {
  const { user } = useAuth()
  const { events, assignments } = useData()

  if (!user || user.role !== 'participant') return <Navigate to="/" replace />

  const items = assignments
    .filter((item) => item.personId === user.personId)
    .map((assignment) => {
      const event = events.find((item) => item.id === assignment.eventId)
      return event ? { assignment, event } : null
    })
    .filter((item) => item !== null)
    .sort((a, b) => compareEvents(a.event, b.event))

  return (
    <div className="page">
      <PageHeader eyebrow="Participante" title="Minha escala" />
      {items.length === 0 ? (
        <p className="empty">Você ainda não está escalado em nenhum evento.</p>
      ) : (
        <div className="scale-grid">
          {items.map(({ assignment, event }) => (
            <article key={assignment.id} className="card scale-card">
              <div className="title-row">
                <h2>
                  <Link to={`/eventos/${event.id}`}>{event.name}</Link>
                </h2>
                <StatusBadge status={event.status} />
              </div>
              <p>
                {formatDate(event.date)} · {event.time}
              </p>
              <p>{event.city}</p>
              <p>{event.venue}</p>
              <div className="role-callout">
                <span>Minha função</span>
                <strong>{assignment.role}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

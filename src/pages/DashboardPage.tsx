import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { useData } from '../context/DataContext.tsx'
import { compareEvents, formatDate, isUpcoming, todayISO } from '../lib/helpers.ts'
import type { CulturalEvent } from '../types.ts'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function EventLine({ event }: { event: CulturalEvent }) {
  return (
    <Link to={`/eventos/${event.id}`} className="event-line">
      <div>
        <strong>{event.name}</strong>
        <span>
          {formatDate(event.date)} · {event.time} · {event.venue}
        </span>
      </div>
      <StatusBadge status={event.status} />
    </Link>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const { events, people, assignments } = useData()
  const isAdmin = user?.role === 'admin'
  const today = todayISO()
  const upcoming = events.filter((event) => isUpcoming(event, today)).sort(compareEvents)
  const barreiras = events.filter((event) => event.city === 'Barreiras').sort(compareEvents)
  const luisEduardo = events.filter((event) => event.city === 'Luís Eduardo Magalhães').sort(compareEvents)
  const myEvents = new Set(
    assignments.filter((item) => item.personId === user?.personId).map((item) => item.eventId),
  )

  return (
    <div className="page">
      <PageHeader eyebrow="Painel" title={`${greeting()}, ${user?.name}`} />

      <section className="stats">
        <Link to="/agenda" className="stat-card">
          <span className="stat-label">Eventos próximos</span>
          <strong className="stat-value">{upcoming.length}</strong>
        </Link>
        {isAdmin ? (
          <Link to="/pessoas" className="stat-card">
            <span className="stat-label">Pessoas cadastradas</span>
            <strong className="stat-value">{people.length}</strong>
          </Link>
        ) : (
          <Link to="/minha-escala" className="stat-card">
            <span className="stat-label">Minha escala</span>
            <strong className="stat-value">{myEvents.size}</strong>
          </Link>
        )}
        <Link to="/agenda?cidade=Barreiras" className="stat-card">
          <span className="stat-label">Barreiras</span>
          <strong className="stat-value">{barreiras.length}</strong>
        </Link>
        <Link to="/agenda?cidade=Luís Eduardo Magalhães" className="stat-card">
          <span className="stat-label">Luís Eduardo Magalhães</span>
          <strong className="stat-value">{luisEduardo.length}</strong>
        </Link>
      </section>

      <div className="shortcuts">
        {isAdmin ? (
          <Link to="/eventos/novo" className="btn btn-primary">
            Novo evento
          </Link>
        ) : null}
        {isAdmin ? (
          <Link to="/pessoas" className="btn btn-secondary">
            Pessoas
          </Link>
        ) : (
          <Link to="/minha-escala" className="btn btn-primary">
            Minha escala
          </Link>
        )}
        <Link to="/agenda" className="btn btn-secondary">
          Agenda
        </Link>
      </div>

      <section className="card">
        <div className="section-head">
          <h2>Próximos eventos</h2>
        </div>
        {upcoming.length === 0 ? (
          <p className="empty">Nenhum evento próximo.</p>
        ) : (
          <div className="event-list">
            {upcoming.map((event) => (
              <EventLine key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <div className="split">
        <section className="card">
          <div className="section-head">
            <h2>Barreiras</h2>
          </div>
          {barreiras.length === 0 ? (
            <p className="empty">Nenhum evento nesta cidade.</p>
          ) : (
            <div className="event-list">
              {barreiras.map((event) => (
                <EventLine key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
        <section className="card">
          <div className="section-head">
            <h2>Luís Eduardo Magalhães</h2>
          </div>
          {luisEduardo.length === 0 ? (
            <p className="empty">Nenhum evento nesta cidade.</p>
          ) : (
            <div className="event-list">
              {luisEduardo.map((event) => (
                <EventLine key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

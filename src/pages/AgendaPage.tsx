import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { useData } from '../context/DataContext.tsx'
import { compareEvents, dateParts, monthLabel, weekdayLabel } from '../lib/helpers.ts'
import type { City, CulturalEvent } from '../types.ts'

type Filter = 'todas' | City

function readFilter(value: string | null): Filter {
  if (value === 'Barreiras' || value === 'Luís Eduardo Magalhães') return value
  return 'todas'
}

export function AgendaPage() {
  const { user } = useAuth()
  const { events } = useData()
  const [params, setParams] = useSearchParams()
  const filter = readFilter(params.get('cidade'))
  const isAdmin = user?.role === 'admin'

  const visible = events
    .filter((event) => (filter === 'todas' ? true : event.city === filter))
    .sort(compareEvents)

  const months: { key: string; events: CulturalEvent[] }[] = []
  for (const event of visible) {
    const key = event.date.slice(0, 7)
    const group = months.find((item) => item.key === key)
    if (group) group.events.push(event)
    else months.push({ key, events: [event] })
  }

  function setFilter(next: Filter) {
    if (next === 'todas') setParams({})
    else setParams({ cidade: next })
  }

  return (
    <div className="page">
      <PageHeader eyebrow="Calendário" title="Agenda">
        {isAdmin ? (
          <Link to="/eventos/novo" className="btn btn-primary">
            Novo evento
          </Link>
        ) : null}
      </PageHeader>

      <div className="filters" role="group" aria-label="Filtrar por cidade">
        <button
          type="button"
          className={filter === 'todas' ? 'chip active' : 'chip'}
          aria-pressed={filter === 'todas'}
          onClick={() => setFilter('todas')}
        >
          Todas
        </button>
        <button
          type="button"
          className={filter === 'Barreiras' ? 'chip active' : 'chip'}
          aria-pressed={filter === 'Barreiras'}
          onClick={() => setFilter('Barreiras')}
        >
          Barreiras
        </button>
        <button
          type="button"
          className={filter === 'Luís Eduardo Magalhães' ? 'chip active' : 'chip'}
          aria-pressed={filter === 'Luís Eduardo Magalhães'}
          onClick={() => setFilter('Luís Eduardo Magalhães')}
        >
          Luís Eduardo Magalhães
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="empty">Nenhum evento encontrado para este filtro.</p>
      ) : (
        <div className="stack">
          {months.map((month) => (
            <section key={month.key} className="stack-sm">
              <h2 className="month-label">{monthLabel(month.key)}</h2>
              <div className="agenda-list">
                {month.events.map((event) => {
                  const parts = dateParts(event.date)
                  return (
                    <Link key={event.id} to={`/eventos/${event.id}`} className="agenda-item">
                      <div className="date-block">
                        <strong>{parts.day}</strong>
                        <span>{parts.month}</span>
                      </div>
                      <div className="agenda-copy">
                        <strong>{event.name}</strong>
                        <p>
                          {weekdayLabel(event.date)} · {event.time}
                        </p>
                        <p>{event.venue}</p>
                      </div>
                      <div className="agenda-meta">
                        <span className="city">{event.city}</span>
                        <StatusBadge status={event.status} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

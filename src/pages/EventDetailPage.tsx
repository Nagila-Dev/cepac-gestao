import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/Modal.tsx'
import { StatusBadge } from '../components/StatusBadge.tsx'
import { TEAM_FUNCTIONS, isTeamFunction } from '../constants.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { useData } from '../context/DataContext.tsx'
import { formatDate, groupAssignments, personName, sortByName } from '../lib/helpers.ts'
import type { Assignment, TeamFunction } from '../types.ts'

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { people, events, assignments, substitutions, deleteEvent, addAssignment, substitutePerson } = useData()
  const event = events.find((item) => item.id === id)
  const isAdmin = user?.role === 'admin'

  const [adding, setAdding] = useState(false)
  const [personId, setPersonId] = useState('')
  const [role, setRole] = useState<TeamFunction | ''>('')
  const [replacing, setReplacing] = useState<Assignment | null>(null)
  const [newPersonId, setNewPersonId] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [dialogError, setDialogError] = useState('')

  if (!event) {
    return (
      <div className="page">
        <h1>Evento não encontrado</h1>
        <Link to="/agenda" className="back-link">
          Voltar para a agenda
        </Link>
      </div>
    )
  }

  const peopleByName = sortByName(people)
  const eventAssignments = assignments.filter((item) => item.eventId === event.id)
  const groups = groupAssignments(eventAssignments).map((group) => ({
    ...group,
    items: [...group.items].sort((a, b) =>
      personName(people, a.personId).localeCompare(personName(people, b.personId), 'pt-BR'),
    ),
  }))
  const history = substitutions
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.eventId === event.id)
    .sort((a, b) => b.item.date.localeCompare(a.item.date) || b.index - a.index)
    .map(({ item }) => item)

  const replaceOptions = peopleByName.filter((person) => {
    if (!replacing) return false
    if (person.id === replacing.personId) return false
    return !eventAssignments.some((item) => item.personId === person.id && item.role === replacing.role)
  })

  function openAdd() {
    setDialogError('')
    setPersonId('')
    setRole('')
    setAdding(true)
  }

  function openReplace(assignment: Assignment) {
    setDialogError('')
    setNewPersonId('')
    setReplacing(assignment)
  }

  function handleAdd(formEvent: FormEvent) {
    formEvent.preventDefault()
    if (!personId || !isTeamFunction(role)) {
      setDialogError('Selecione a pessoa e a função.')
      return
    }
    const message = addAssignment(event!.id, personId, role)
    if (message) {
      setDialogError(message)
      return
    }
    setAdding(false)
  }

  function handleReplace(formEvent: FormEvent) {
    formEvent.preventDefault()
    if (!replacing || !newPersonId) {
      setDialogError('Selecione a nova pessoa.')
      return
    }
    const message = substitutePerson(replacing.id, newPersonId)
    if (message) {
      setDialogError(message)
      return
    }
    setReplacing(null)
  }

  function handleDelete() {
    deleteEvent(event!.id)
    navigate('/agenda')
  }

  return (
    <div className="page">
      <Link to="/agenda" className="back-link">
        Voltar para a agenda
      </Link>

      <div className="title-row">
        <div>
          <h1>{event.name}</h1>
          <p className="meta-line">
            {formatDate(event.date)} · {event.time} · {event.city} · {event.venue}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>

      {isAdmin ? (
        <div className="page-actions">
          <Link to={`/eventos/${event.id}/editar`} className="btn btn-secondary">
            Editar
          </Link>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
            Excluir
          </button>
        </div>
      ) : null}

      <section className="card">
        <div className="section-head">
          <h2>Informações</h2>
        </div>
        <dl className="meta-grid">
          <div>
            <dt>Responsável pelo evento</dt>
            <dd>{personName(people, event.eventLeadId)}</dd>
          </div>
          <div>
            <dt>Responsável pelo vestuário</dt>
            <dd>{personName(people, event.wardrobeLeadId)}</dd>
          </div>
          <div>
            <dt>Responsável pelo roteiro</dt>
            <dd>{personName(people, event.scriptLeadId)}</dd>
          </div>
          <div>
            <dt>Responsável pela música</dt>
            <dd>{personName(people, event.musicLeadId)}</dd>
          </div>
        </dl>
        <div className="notes">
          <h3>Observações</h3>
          <p>{event.notes || 'Sem observações.'}</p>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Equipe</h2>
          {isAdmin ? (
            <button type="button" className="btn btn-small btn-primary" onClick={openAdd}>
              Adicionar pessoa
            </button>
          ) : null}
        </div>
        {groups.length === 0 ? (
          <p className="empty">Nenhuma pessoa adicionada a este evento.</p>
        ) : (
          groups.map((group) => (
            <div key={group.role} className="team-block">
              <h3>{group.role}</h3>
              {group.items.map((item) => {
                const person = people.find((entry) => entry.id === item.personId)
                return (
                  <div key={item.id} className="member">
                    <div>
                      <strong>{person?.name ?? 'Pessoa não encontrada'}</strong>
                      <small>{isAdmin ? `${person?.type ?? ''} · ${person?.phone ?? ''}` : person?.type}</small>
                    </div>
                    {isAdmin ? (
                      <button type="button" className="btn btn-small btn-secondary" onClick={() => openReplace(item)}>
                        Substituir
                      </button>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Histórico</h2>
        </div>
        {history.length === 0 ? (
          <p className="empty">Nenhuma substituição registrada.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <article key={item.id} className="history-item">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <p>
                  {personName(people, item.previousPersonId)} foi substituído por {personName(people, item.newPersonId)}
                </p>
                <p>Função: {item.role}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {adding ? (
        <Modal title="Adicionar à equipe" onClose={() => setAdding(false)}>
          <form className="stack" onSubmit={handleAdd} noValidate>
            {dialogError ? <p className="form-error">{dialogError}</p> : null}
            <label className="field">
              <span>Pessoa</span>
              <select value={personId} onChange={(formEvent) => setPersonId(formEvent.target.value)}>
                <option value="">Selecione</option>
                {peopleByName.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Função</span>
              <select
                value={role}
                onChange={(formEvent) => setRole(isTeamFunction(formEvent.target.value) ? formEvent.target.value : '')}
              >
                <option value="">Selecione</option>
                {TEAM_FUNCTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setAdding(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {replacing ? (
        <Modal
          title={`Substituir ${personName(people, replacing.personId)}`}
          onClose={() => setReplacing(null)}
        >
          <form className="stack" onSubmit={handleReplace} noValidate>
            {dialogError ? <p className="form-error">{dialogError}</p> : null}
            <p className="meta-line">Função: {replacing.role}</p>
            {replaceOptions.length === 0 ? (
              <p className="empty">Não há outra pessoa disponível para esta função.</p>
            ) : (
              <label className="field">
                <span>Nova pessoa</span>
                <select value={newPersonId} onChange={(formEvent) => setNewPersonId(formEvent.target.value)}>
                  <option value="">Selecione</option>
                  {replaceOptions.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setReplacing(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={replaceOptions.length === 0}>
                Substituir
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {confirmDelete ? (
        <Modal title="Excluir evento" onClose={() => setConfirmDelete(false)}>
          <div className="stack">
            <p>Excluir este evento? A equipe e o histórico de substituições vinculados a ele também serão removidos.</p>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

import { useState, type FormEvent } from 'react'
import { Modal } from '../components/Modal.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { PERSON_TYPES, isPersonType } from '../constants.ts'
import { useData } from '../context/DataContext.tsx'
import { sortByName } from '../lib/helpers.ts'
import type { Person, PersonType } from '../types.ts'

type FormState = {
  id: string
  name: string
  phone: string
  type: PersonType | ''
}

const emptyForm: FormState = { id: '', name: '', phone: '', type: '' }

export function PeoplePage() {
  const { people, savePerson, deletePerson } = useData()
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [pageError, setPageError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Person | null>(null)

  const filtered = sortByName(people).filter((person) => {
    const term = query.trim().toLowerCase()
    if (!term) return true
    return person.name.toLowerCase().includes(term) || person.phone.toLowerCase().includes(term)
  })

  function openCreate() {
    setForm(emptyForm)
    setError('')
    setPageError('')
    setOpen(true)
  }

  function openEdit(person: Person) {
    setForm({ id: person.id, name: person.name, phone: person.phone, type: person.type })
    setError('')
    setPageError('')
    setOpen(true)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !isPersonType(form.type)) {
      setError('Preencha nome, telefone e tipo.')
      return
    }
    savePerson({
      id: form.id || undefined,
      name: form.name,
      phone: form.phone,
      type: form.type,
    })
    setOpen(false)
  }

  function requestDelete(person: Person) {
    setPageError('')
    const message = deletePerson(person.id)
    if (message) {
      setPageError(message)
      return
    }
  }

  return (
    <div className="page">
      <PageHeader eyebrow="Cadastro" title="Pessoas">
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Nova pessoa
        </button>
      </PageHeader>

      <label className="field search-field">
        <span>Pesquisar</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nome ou telefone"
        />
      </label>

      {pageError ? <p className="form-error">{pageError}</p> : null}

      {filtered.length === 0 ? (
        <p className="empty">Nenhuma pessoa encontrada.</p>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td data-label="Nome">{person.name}</td>
                  <td data-label="Telefone">{person.phone}</td>
                  <td data-label="Tipo">
                    <span className="pill">{person.type}</span>
                  </td>
                  <td data-label="Ações">
                    <div className="row-actions">
                      <button type="button" className="btn btn-small btn-secondary" onClick={() => openEdit(person)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          setPageError('')
                          setPendingDelete(person)
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <Modal title={form.id ? 'Editar pessoa' : 'Nova pessoa'} onClose={() => setOpen(false)}>
          <form className="stack" onSubmit={handleSubmit} noValidate>
            {error ? <p className="form-error">{error}</p> : null}
            <label className="field">
              <span>Nome</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                maxLength={80}
              />
            </label>
            <label className="field">
              <span>Telefone</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                maxLength={20}
              />
            </label>
            <label className="field">
              <span>Tipo</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: isPersonType(event.target.value) ? event.target.value : '',
                  }))
                }
              >
                <option value="">Selecione</option>
                {PERSON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal title="Excluir pessoa" onClose={() => setPendingDelete(null)}>
          <div className="stack">
            <p>Excluir {pendingDelete.name}? Esta ação não pode ser desfeita.</p>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setPendingDelete(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  requestDelete(pendingDelete)
                  setPendingDelete(null)
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

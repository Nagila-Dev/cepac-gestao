import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createId, todayISO } from '../lib/helpers.ts'
import { loadData, saveData } from '../storage.ts'
import type { AppData, CulturalEvent, Person, PersonType, TeamFunction } from '../types.ts'

type PersonInput = {
  id?: string
  name: string
  phone: string
  type: PersonType
}

type EventInput = Omit<CulturalEvent, 'id'> & { id?: string }

type DataContextValue = {
  people: Person[]
  events: CulturalEvent[]
  assignments: AppData['assignments']
  substitutions: AppData['substitutions']
  savePerson: (input: PersonInput) => void
  deletePerson: (id: string) => string | null
  saveEvent: (input: EventInput) => string
  deleteEvent: (id: string) => void
  addAssignment: (eventId: string, personId: string, role: TeamFunction) => string | null
  substitutePerson: (assignmentId: string, newPersonId: string) => string | null
}

const DataContext = createContext<DataContextValue | null>(null)

function personIsLinked(data: AppData, id: string) {
  if (data.assignments.some((item) => item.personId === id)) return true
  if (data.substitutions.some((item) => item.previousPersonId === id || item.newPersonId === id)) return true
  return data.events.some((event) =>
    [event.eventLeadId, event.wardrobeLeadId, event.scriptLeadId, event.musicLeadId].includes(id),
  )
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const value = useMemo<DataContextValue>(
    () => ({
      people: data.people,
      events: data.events,
      assignments: data.assignments,
      substitutions: data.substitutions,
      savePerson(input) {
        const person: Person = {
          id: input.id || createId(),
          name: input.name.trim(),
          phone: input.phone.trim(),
          type: input.type,
        }
        setData((current) => {
          const exists = current.people.some((item) => item.id === person.id)
          return {
            ...current,
            people: exists
              ? current.people.map((item) => (item.id === person.id ? person : item))
              : [...current.people, person],
          }
        })
      },
      deletePerson(id) {
        if (personIsLinked(data, id)) {
          return 'Esta pessoa está vinculada a um evento e não pode ser excluída.'
        }
        setData((current) => ({
          ...current,
          people: current.people.filter((person) => person.id !== id),
        }))
        return null
      },
      saveEvent(input) {
        const id = input.id || createId()
        const event: CulturalEvent = {
          id,
          name: input.name.trim(),
          date: input.date,
          time: input.time,
          city: input.city,
          venue: input.venue.trim(),
          eventLeadId: input.eventLeadId,
          wardrobeLeadId: input.wardrobeLeadId,
          scriptLeadId: input.scriptLeadId,
          musicLeadId: input.musicLeadId,
          notes: input.notes.trim(),
          status: input.status,
        }
        setData((current) => {
          const exists = current.events.some((item) => item.id === id)
          return {
            ...current,
            events: exists ? current.events.map((item) => (item.id === id ? event : item)) : [...current.events, event],
          }
        })
        return id
      },
      deleteEvent(id) {
        setData((current) => ({
          ...current,
          events: current.events.filter((event) => event.id !== id),
          assignments: current.assignments.filter((item) => item.eventId !== id),
          substitutions: current.substitutions.filter((item) => item.eventId !== id),
        }))
      },
      addAssignment(eventId, personId, role) {
        const duplicate = data.assignments.some(
          (item) => item.eventId === eventId && item.personId === personId && item.role === role,
        )
        if (duplicate) return 'Esta pessoa já está escalada nesta função.'
        setData((current) => ({
          ...current,
          assignments: [...current.assignments, { id: createId(), eventId, personId, role }],
        }))
        return null
      },
      substitutePerson(assignmentId, newPersonId) {
        const currentAssignment = data.assignments.find((item) => item.id === assignmentId)
        if (!currentAssignment) return 'Não foi possível localizar esta pessoa na equipe.'
        if (currentAssignment.personId === newPersonId) return 'Escolha uma pessoa diferente.'
        const duplicate = data.assignments.some(
          (item) =>
            item.eventId === currentAssignment.eventId &&
            item.personId === newPersonId &&
            item.role === currentAssignment.role,
        )
        if (duplicate) return 'Esta pessoa já exerce esta função no evento.'

        setData((current) => ({
          ...current,
          assignments: current.assignments.map((item) =>
            item.id === assignmentId ? { ...item, personId: newPersonId } : item,
          ),
          substitutions: [
            ...current.substitutions,
            {
              id: createId(),
              eventId: currentAssignment.eventId,
              previousPersonId: currentAssignment.personId,
              newPersonId,
              role: currentAssignment.role,
              date: todayISO(),
            },
          ],
        }))
        return null
      },
    }),
    [data],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData deve ser usado dentro de DataProvider')
  return context
}

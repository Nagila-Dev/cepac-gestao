import { TEAM_FUNCTIONS } from '../constants.ts'
import type { Assignment, CulturalEvent, Person } from '../types.ts'

const SHORT_MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const FULL_MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export function createId() {
  return crypto.randomUUID()
}

export function todayISO() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}/${month}/${year}`
}

export function dateParts(iso: string) {
  const [, month, day] = iso.split('-')
  return {
    day,
    month: SHORT_MONTHS[Number(month) - 1] ?? '',
  }
}

export function monthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split('-')
  const name = FULL_MONTHS[Number(month) - 1] ?? ''
  const titled = name ? name.charAt(0).toUpperCase() + name.slice(1) : yearMonth
  return `${titled} de ${year}`
}

export function weekdayLabel(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return ''
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

export function personName(people: Person[], id: string) {
  if (!id) return 'Não definido'
  return people.find((person) => person.id === id)?.name ?? 'Não definido'
}

export function isUpcoming(event: CulturalEvent, today: string) {
  return event.date >= today && event.status !== 'Cancelado' && event.status !== 'Realizado'
}

export function compareEvents(a: CulturalEvent, b: CulturalEvent) {
  return a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.name.localeCompare(b.name, 'pt-BR')
}

export function sortByName(people: Person[]) {
  return [...people].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export function groupAssignments(assignments: Assignment[]) {
  return TEAM_FUNCTIONS.map((role) => ({
    role,
    items: assignments.filter((item) => item.role === role),
  })).filter((group) => group.items.length > 0)
}

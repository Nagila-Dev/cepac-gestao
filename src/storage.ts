import { createDemoData } from './seed.ts'
import type { AppData } from './types.ts'

const STORAGE_KEY = 'cepac-gestao.v1'

function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const data = value as AppData
  return (
    Array.isArray(data.people) &&
    Array.isArray(data.events) &&
    Array.isArray(data.assignments) &&
    Array.isArray(data.substitutions)
  )
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isAppData(parsed)) return parsed
    }
  } catch {
    // Storage indisponível ou JSON inválido: segue com os dados demonstrativos.
  }

  const initial = createDemoData()
  saveData(initial)
  return initial
}

export function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Se o navegador bloquear o storage, a sessão atual continua em memória.
  }
}

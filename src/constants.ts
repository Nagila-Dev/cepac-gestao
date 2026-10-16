import type { City, EventStatus, PersonType, TeamFunction, User } from './types.ts'

export const CITIES: City[] = ['Barreiras', 'Luís Eduardo Magalhães']

export const EVENT_STATUSES: EventStatus[] = ['Planejado', 'Confirmado', 'Realizado', 'Cancelado']

export const PERSON_TYPES: PersonType[] = ['Ator', 'Músico', 'Produção', 'Técnica', 'Outro']

export const TEAM_FUNCTIONS: TeamFunction[] = [
  'Responsável pelo evento',
  'Vestuário',
  'Roteiro',
  'Música',
  'Músico',
  'Ator',
  'Técnica',
  'Produção',
  'Outra',
]

/**
 * Contas apenas para demonstração. Não há tela de cadastro de usuários.
 * A senha não é gravada no navegador: a sessão guarda somente o nome de usuário.
 */
export const USERS: User[] = [
  { username: 'felipe', password: '123456', name: 'Felipe', role: 'admin' },
  { username: 'maria', password: '123456', name: 'Maria', role: 'admin' },
  { username: 'joao', password: '123456', name: 'João Silva', role: 'participant', personId: 'p-joao' },
  { username: 'ana', password: '123456', name: 'Ana Costa', role: 'participant', personId: 'p-ana' },
  { username: 'carlos', password: '123456', name: 'Carlos Mendes', role: 'participant', personId: 'p-carlos' },
]

export function isCity(value: string): value is City {
  return (CITIES as string[]).includes(value)
}

export function isEventStatus(value: string): value is EventStatus {
  return (EVENT_STATUSES as string[]).includes(value)
}

export function isPersonType(value: string): value is PersonType {
  return (PERSON_TYPES as string[]).includes(value)
}

export function isTeamFunction(value: string): value is TeamFunction {
  return (TEAM_FUNCTIONS as string[]).includes(value)
}

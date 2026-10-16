export type UserRole = 'admin' | 'participant'

export type City = 'Barreiras' | 'Luís Eduardo Magalhães'

export type EventStatus = 'Planejado' | 'Confirmado' | 'Realizado' | 'Cancelado'

export type PersonType = 'Ator' | 'Músico' | 'Produção' | 'Técnica' | 'Outro'

export type TeamFunction =
  | 'Responsável pelo evento'
  | 'Vestuário'
  | 'Roteiro'
  | 'Música'
  | 'Músico'
  | 'Ator'
  | 'Técnica'
  | 'Produção'
  | 'Outra'

export type User = {
  username: string
  password: string
  name: string
  role: UserRole
  personId?: string
}

export type Person = {
  id: string
  name: string
  phone: string
  type: PersonType
}

export type CulturalEvent = {
  id: string
  name: string
  date: string
  time: string
  city: City
  venue: string
  eventLeadId: string
  wardrobeLeadId: string
  scriptLeadId: string
  musicLeadId: string
  notes: string
  status: EventStatus
}

export type Assignment = {
  id: string
  eventId: string
  personId: string
  role: TeamFunction
}

export type Substitution = {
  id: string
  eventId: string
  previousPersonId: string
  newPersonId: string
  role: TeamFunction
  date: string
}

export type AppData = {
  people: Person[]
  events: CulturalEvent[]
  assignments: Assignment[]
  substitutions: Substitution[]
}

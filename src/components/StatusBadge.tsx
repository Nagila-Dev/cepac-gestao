import type { EventStatus } from '../types.ts'

const STATUS_CLASS: Record<EventStatus, string> = {
  Planejado: 'badge planned',
  Confirmado: 'badge confirmed',
  Realizado: 'badge done',
  Cancelado: 'badge canceled',
}

export function StatusBadge({ status }: { status: EventStatus }) {
  return <span className={STATUS_CLASS[status]}>{status}</span>
}

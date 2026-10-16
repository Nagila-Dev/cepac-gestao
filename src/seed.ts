import type { AppData } from './types.ts'

/**
 * DADOS DEMONSTRATIVOS
 *
 * Pessoas, eventos, equipes e o histórico abaixo são fictícios.
 * Servem só para a apresentação visual do CEPAC Gestão.
 * Não representam pessoas nem espetáculos reais da instituição.
 *
 * Na primeira abertura, este conjunto é gravado no localStorage.
 * Depois disso, o sistema usa apenas o que estiver salvo no navegador.
 */
export function createDemoData(): AppData {
  return {
    people: [
      { id: 'p-joao', name: 'João Silva', phone: '(77) 98801-1001', type: 'Músico' },
      { id: 'p-ana', name: 'Ana Costa', phone: '(77) 98801-1002', type: 'Ator' },
      { id: 'p-carlos', name: 'Carlos Mendes', phone: '(77) 98801-1003', type: 'Músico' },
      { id: 'p-pedro', name: 'Pedro Alves', phone: '(77) 98801-1004', type: 'Ator' },
      { id: 'p-lucas', name: 'Lucas Ferreira', phone: '(77) 98801-1005', type: 'Ator' },
      { id: 'p-beatriz', name: 'Beatriz Santos', phone: '(77) 98801-1006', type: 'Produção' },
      { id: 'p-rafael', name: 'Rafael Lima', phone: '(77) 98801-1007', type: 'Técnica' },
      { id: 'p-helena', name: 'Helena Duarte', phone: '(77) 98801-1008', type: 'Outro' },
    ],
    events: [
      {
        id: 'e-casa',
        name: 'Espetáculo "A Casa"',
        date: '2026-11-15',
        time: '19:00',
        city: 'Barreiras',
        venue: 'Teatro Municipal',
        eventLeadId: 'p-beatriz',
        wardrobeLeadId: 'p-helena',
        scriptLeadId: 'p-ana',
        musicLeadId: '',
        notes: 'Montagem com elenco local. A equipe chega ao teatro uma hora antes do início.',
        status: 'Confirmado',
      },
      {
        id: 'e-vozes',
        name: 'Show Musical "Vozes do Oeste"',
        date: '2026-11-22',
        time: '20:00',
        city: 'Luís Eduardo Magalhães',
        venue: 'Centro Cultural',
        eventLeadId: 'p-beatriz',
        wardrobeLeadId: 'p-helena',
        scriptLeadId: '',
        musicLeadId: 'p-carlos',
        notes: 'Show com repertório regional. A passagem de som acontece no início da tarde.',
        status: 'Planejado',
      },
      {
        id: 'e-cultura',
        name: 'Espetáculo "Cultura em Cena"',
        date: '2026-12-05',
        time: '18:30',
        city: 'Barreiras',
        venue: 'Casa de Cultura',
        eventLeadId: 'p-beatriz',
        wardrobeLeadId: 'p-helena',
        scriptLeadId: 'p-pedro',
        musicLeadId: 'p-joao',
        notes: 'Espetáculo com cena e música ao vivo, reunindo elenco e produção.',
        status: 'Confirmado',
      },
    ],
    assignments: [
      { id: 'a-casa-ana', eventId: 'e-casa', personId: 'p-ana', role: 'Ator' },
      { id: 'a-casa-pedro', eventId: 'e-casa', personId: 'p-pedro', role: 'Ator' },
      { id: 'a-casa-lucas', eventId: 'e-casa', personId: 'p-lucas', role: 'Ator' },
      { id: 'a-casa-beatriz', eventId: 'e-casa', personId: 'p-beatriz', role: 'Produção' },
      { id: 'a-casa-helena', eventId: 'e-casa', personId: 'p-helena', role: 'Vestuário' },

      { id: 'a-vozes-carlos', eventId: 'e-vozes', personId: 'p-carlos', role: 'Músico' },
      { id: 'a-vozes-rafael', eventId: 'e-vozes', personId: 'p-rafael', role: 'Técnica' },
      { id: 'a-vozes-beatriz', eventId: 'e-vozes', personId: 'p-beatriz', role: 'Produção' },

      { id: 'a-cultura-ana', eventId: 'e-cultura', personId: 'p-ana', role: 'Ator' },
      { id: 'a-cultura-pedro', eventId: 'e-cultura', personId: 'p-pedro', role: 'Ator' },
      { id: 'a-cultura-lucas', eventId: 'e-cultura', personId: 'p-lucas', role: 'Ator' },
      { id: 'a-cultura-joao', eventId: 'e-cultura', personId: 'p-joao', role: 'Músico' },
      { id: 'a-cultura-carlos', eventId: 'e-cultura', personId: 'p-carlos', role: 'Músico' },
      { id: 'a-cultura-beatriz', eventId: 'e-cultura', personId: 'p-beatriz', role: 'Produção' },
    ],
    substitutions: [
      {
        id: 's-vozes-1',
        eventId: 'e-vozes',
        previousPersonId: 'p-joao',
        newPersonId: 'p-carlos',
        role: 'Músico',
        date: '2026-09-28',
      },
    ],
  }
}

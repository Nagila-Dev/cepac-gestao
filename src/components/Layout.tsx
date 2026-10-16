import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconAgenda() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v3M16 3.5v3M4 9.5h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 18.5c.6-2.4 2.4-3.7 4.5-3.7s3.9 1.3 4.5 3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16.2" cy="8.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M15.2 14.8c1.6.2 2.9 1.2 3.5 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconScale() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 6h11M8 12h11M8 18h11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M4.5 6h.5M4.5 12h.5M4.5 18h.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <div
        className={open ? 'sidebar-overlay visible' : 'sidebar-overlay'}
        onClick={() => setOpen(false)}
      />
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <span className="brand-mark">C</span>
          <span className="brand-copy">
            <strong>CEPAC Gestão</strong>
            <small>Extensão universitária</small>
          </span>
        </div>
        <nav className="side-nav" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setOpen(false)}>
            <IconHome />
            Início
          </NavLink>
          <NavLink to="/agenda" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setOpen(false)}>
            <IconAgenda />
            Agenda
          </NavLink>
          {isAdmin ? (
            <NavLink to="/pessoas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setOpen(false)}>
              <IconPeople />
              Pessoas
            </NavLink>
          ) : (
            <NavLink to="/minha-escala" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setOpen(false)}>
              <IconScale />
              Minha escala
            </NavLink>
          )}
        </nav>
        <div className="sidebar-user">
          <div className="user-copy">
            <strong>{user?.name}</strong>
            <small>{isAdmin ? 'Administrador' : 'Participante'}</small>
          </div>
          <button type="button" className="btn btn-small btn-secondary" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>
      <div className="main-column">
        <div className="mobile-bar">
          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <strong>CEPAC Gestão</strong>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

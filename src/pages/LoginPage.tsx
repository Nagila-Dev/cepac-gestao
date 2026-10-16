import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const ok = login(username, password)
    if (!ok) {
      setError('Usuário ou senha inválidos.')
      return
    }
    navigate('/')
  }

  return (
    <div className="login-screen">
      <div className="stage-lights" aria-hidden="true">
        <span className="spot spot-left" />
        <span className="spot spot-center" />
        <span className="spot spot-right" />
      </div>
      <aside className="login-aside">
        <div className="theater-masks" aria-hidden="true">
          <svg className="theater-mask" viewBox="0 0 72 90">
            <path
              fill="#f6f0e6"
              d="M36 4c16.5 0 29 14.5 29 35.2 0 18.4-8.2 33-18.6 41.2-2.4 1.9-3.6 4.8-2.7 7.6.6 1.8-.8 3.5-2.7 3.5H31c-1.9 0-3.3-1.7-2.7-3.5.9-2.8-.3-5.7-2.7-7.6C15.2 72.2 7 57.6 7 39.2 7 18.5 19.5 4 36 4z"
            />
            <path
              d="M22 32c3.2-3.2 9.8-3.2 13 0M37 32c3.2-3.2 9.8-3.2 13 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M22 42c3.4-5.2 11.6-5.2 15 0M37 42c3.4-5.2 11.6-5.2 15 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M24 58c3.6 8.5 20.4 8.5 24 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path d="M30 58c2.2 4.2 9.8 4.2 12 0" fill="#241033" />
          </svg>
          <svg className="theater-mask" viewBox="0 0 72 90">
            <path
              fill="#e6d3b4"
              d="M36 4c16.5 0 29 14.5 29 35.2 0 18.4-8.2 33-18.6 41.2-2.4 1.9-3.6 4.8-2.7 7.6.6 1.8-.8 3.5-2.7 3.5H31c-1.9 0-3.3-1.7-2.7-3.5.9-2.8-.3-5.7-2.7-7.6C15.2 72.2 7 57.6 7 39.2 7 18.5 19.5 4 36 4z"
            />
            <path
              d="M22 30c3.2 3.2 9.8 3.2 13 0M37 30c3.2 3.2 9.8 3.2 13 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M22 44c3.4 5.2 11.6 5.2 15 0M37 44c3.4 5.2 11.6 5.2 15 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M24 70c3.6-8.5 20.4-8.5 24 0"
              fill="none"
              stroke="#241033"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path d="M49 48c1.2 8-1.4 14-1.4 14" fill="none" stroke="#241033" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="47.2" cy="64" r="1.7" fill="#241033" />
          </svg>
        </div>
        <div className="brand">
          <span className="brand-mark">C</span>
          <span className="brand-copy">
            <strong>CEPAC Gestão</strong>
            <small>Extensão universitária</small>
          </span>
        </div>
        <div>
          <h1>A agenda cultural em um só lugar.</h1>
          <p>
            Organize espetáculos, shows e equipes do CEPAC em Barreiras e Luís Eduardo Magalhães.
          </p>
        </div>
        <p className="aside-foot">Barreiras · Luís Eduardo Magalhães</p>
      </aside>
      <main className="login-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div>
            <p className="eyebrow">Acesso</p>
            <h2>Entrar</h2>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <label className="field">
            <span>Usuário</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            Entrar
          </button>
          <div className="demo-box">
            <strong>Acesso de demonstração</strong>
            <p>Administradores: felipe, maria</p>
            <p>Participantes: joao, ana, carlos</p>
            <p>Senha: 123456</p>
          </div>
        </form>
      </main>
    </div>
  )
}

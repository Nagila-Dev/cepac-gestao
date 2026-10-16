import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import { RequireAdmin, RequireAuth } from './components/guards.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DataProvider } from './context/DataContext.tsx'
import { AgendaPage } from './pages/AgendaPage.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { EventDetailPage } from './pages/EventDetailPage.tsx'
import { EventFormRoute } from './pages/EventFormPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { MySchedulePage } from './pages/MySchedulePage.tsx'
import { PeoplePage } from './pages/PeoplePage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/agenda" element={<AgendaPage />} />
                <Route path="/eventos/:id" element={<EventDetailPage />} />
                <Route path="/minha-escala" element={<MySchedulePage />} />
                <Route element={<RequireAdmin />}>
                  <Route path="/eventos/novo" element={<EventFormRoute />} />
                  <Route path="/eventos/:id/editar" element={<EventFormRoute />} />
                  <Route path="/pessoas" element={<PeoplePage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

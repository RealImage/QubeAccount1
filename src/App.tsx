import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './data/store'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { CompanyList } from './pages/CompanyList'
import { CompanyForm } from './pages/CompanyForm'
import { CompanyDetail } from './pages/CompanyDetail'
import { ServicesCatalog } from './pages/ServicesCatalog'
import { ServiceConfigure } from './pages/ServiceConfigure'
import { PortalUsers } from './pages/PortalUsers'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="companies/new" element={<CompanyForm />} />
            <Route path="companies/:id" element={<CompanyDetail />} />
            <Route path="companies/:id/edit" element={<CompanyForm />} />
            <Route path="portal-users" element={<PortalUsers />} />
            <Route path="services" element={<ServicesCatalog />} />
            <Route path="services/:id" element={<ServiceConfigure />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

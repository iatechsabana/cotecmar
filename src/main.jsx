import ManualUsuarioPage from './pages/ManualUsuarioPage.jsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext.jsx';
import './index.css';
import LoginPage from './pages/Login.jsx';
import LiderDashboardPage from './pages/dashboards/LiderDashboardPage.jsx';
import DashboardKPIsPage from './pages/dashboards/DashboardKPIsPage.jsx';
import DashboardModelistaPage from './pages/dashboards/DashboardModelistaPage.jsx';
import DiccionarioMetricasPage from './pages/DiccionarioMetricasPage.jsx';
import MetodologiaPage from './pages/MetodologiaPage.jsx';
import PlantillaAvance from './pages/PlantillaAvancePage.jsx';
import CalculadoraCgtPage from './pages/CalculadoraCgtPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard-lider" element={<LiderDashboardPage />} />
          <Route path="/dashboard-kpis" element={<DashboardKPIsPage />} />
          <Route path="/dashboard-modelista" element={<DashboardModelistaPage />} />
          <Route path="/manual-usuario" element={<ManualUsuarioPage />} />
          <Route path="/diccionario-metricas" element={<DiccionarioMetricasPage />} />
          <Route path="/metodologias" element={<MetodologiaPage />} />
          <Route path="/calculadora-cgt" element={<CalculadoraCgtPage />} />
          <Route path="/plantilla-avances" element={<PlantillaAvance />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

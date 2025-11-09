"use client";

import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { getAvancesByUser, getProductividadEvents } from "../../lib/firestoreService";

export default function DashboardModelistaPage() {
  const [activeTab, setActiveTab] = useState("resumen");
  const { user: authUser, isAuthenticated } = useAuth();

  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar avances reales del usuario modelista
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isAuthenticated || !authUser?.uid) return;
      setLoading(true);
      try {
        const data = await getAvancesByUser(authUser.uid);
        if (mounted) {
          // Normalize
          const normalized = (data || []).map((a) => ({
            ...a,
            reprocesos: a.reprocesos || [],
            horasInvertidas: Number(a.horasInvertidas) || 0,
            avanceMm: Number(a.avanceMm) || 0,
            totalMm: Number(a.totalMm) || 0,
          }));
          setAvances(normalized);
        }
      } catch (err) {
        console.error('Error cargando avances del usuario:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [isAuthenticated, authUser]);

    // Cargar eventos de productividad y filtrarlos por operario (nombre)
    const [prodEvents, setProdEvents] = useState([]);
    useEffect(() => {
      let mounted = true;
      (async () => {
        if (!isAuthenticated || !authUser) return;
        try {
          const all = await getProductividadEvents();
          // Filtrar por operario (nombre) si existe
          const nombre = authUser?.nombre || '';
          const filtered = (all || []).filter(e => {
            if (!nombre) return false;
            return String(e.operario || '').toLowerCase() === String(nombre).toLowerCase();
          }).map(e => ({ ...e, duracionMin: Number(e.duracionMin) || 0 }));
          if (!mounted) return;
          setProdEvents(filtered);
        } catch (err) {
          console.error('Error cargando eventos productividad:', err);
        }
      })();
      return () => { mounted = false; };
    }, [isAuthenticated, authUser]);

  // KPIs calculados a partir de avances + productividad
  const totalHorasAvances = useMemo(() => avances.reduce((s, a) => s + (a.horasInvertidas || 0), 0), [avances]);
  const totalHorasProd = useMemo(() => prodEvents.reduce((s, p) => s + (p.duracionMin || 0), 0), [prodEvents]);
  const totalHoras = totalHorasAvances + totalHorasProd;
  const completadas = useMemo(() => avances.filter(a => a.estado === 'Completado').length, [avances]);
  const enProgreso = useMemo(() => avances.filter(a => a.estado === 'En progreso').length, [avances]);
  const bloqueadas = useMemo(() => avances.filter(a => a.estado === 'Bloqueado').length, [avances]);

  const getStatusVariant = (estado) => {
    switch (estado) {
      case "Completado": return "default";
      case "En progreso": return "secondary";
      case "Bloqueado": return "destructive";
      default: return "outline";
    }
  };

  if (activeTab === "resumen") {
    return (
      <MainLayout activeKey="dashboard" onLogout={() => alert('Cerrar sesión')}>
        {/* Contenedor centrado vertical y horizontalmente */}
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-full mx-auto max-w-7xl space-y-6 px-6 md:px-8">
            <header className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-3xl font-bold text-[#2f2b79]">Dashboard Modelista</h1>
                <p className="text-[#36418a] text-sm">Vista general de actividades y proyectos asignados</p>
              </div>

              <Button onClick={() => setActiveTab("plantilla")} className="gap-2 bg-white text-black hover:bg-white/80">
                <Plus className="w-4 h-4" /> Nuevo Registro
              </Button>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              <Card className="bg-white rounded-xl shadow p-4">
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-[#e6eefc] rounded-lg flex items-center justify-center">
                    <Clock className="w-7 h-7 text-[#2f2b79]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2f2b79]">{loading ? '—' : totalHoras}</p>
                    <p className="text-xs text-[#36418a]">Horas Totales</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow p-4">
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2f2b79]">{loading ? '—' : completadas}</p>
                    <p className="text-xs text-[#36418a]">Completadas</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow p-4">
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2f2b79]">{loading ? '—' : enProgreso}</p>
                    <p className="text-xs text-[#36418a]">En Progreso</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow p-4">
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#2f2b79]">{loading ? '—' : bloqueadas}</p>
                    <p className="text-xs text-[#36418a]">Bloqueadas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts + Proyectos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 w-full">
              <Card className="bg-white rounded-xl shadow p-4">
                <CardHeader>
                  <CardTitle className="text-[#2f2b79]">Horas por Actividad</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={(() => {
                      // Agregar horas por actividad desde avances
                      const acc = {};
                      for (const a of avances) {
                        const key = a.actividad || 'Sin actividad';
                        acc[key] = (acc[key] || 0) + (a.horasInvertidas || 0);
                      }
                      // Añadir eventos de productividad agrupados por sistema o tipo
                      for (const p of prodEvents) {
                        const key = `Prod: ${p.sistema || p.tipo || 'Otros'}`;
                        acc[key] = (acc[key] || 0) + (p.duracionMin || 0);
                      }
                      return Object.entries(acc).map(([actividad, horas]) => ({ actividad, horas }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="actividad" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="horas" fill="#2f2b79" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow p-4">
                <CardHeader>
                  <CardTitle className="text-[#2f2b79]">Proyectos Activos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {(() => {
                    const proyectosMap = new Map();
                    for (const a of avances) {
                      const key = a.proyecto || 'Sin proyecto';
                      const entry = proyectosMap.get(key) || { proyecto: key, horas: 0, avanceMm: 0, totalMm: 0, count: 0, estado: 'En progreso' };
                      entry.horas += (a.horasInvertidas || 0);
                      entry.avanceMm += (a.avanceMm || 0);
                      entry.totalMm += (a.totalMm || 0);
                      entry.count += 1;
                      if (a.estado === 'Completado') entry.estado = 'Completado';
                      proyectosMap.set(key, entry);
                    }

                    const proyectos = Array.from(proyectosMap.values());
                    if (!proyectos.length) return <p className="text-sm text-[#36418a]">No hay proyectos asignados.</p>
                    return proyectos.map((project, idx) => (
                      <div key={idx} className="p-5 border rounded-xl bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#2f2b79]">{project.proyecto}</h4>
                          <Badge variant={getStatusVariant(project.estado)}>{project.estado}</Badge>
                        </div>

                        <p className="text-sm text-[#36418a] mb-2">Registros: {project.count}</p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-[#36418a]">
                            <span>Avance: {project.avanceMm}mm / {project.totalMm}mm</span>
                            <span>{project.totalMm ? Math.round((project.avanceMm / project.totalMm) * 100) : 0}%</span>
                          </div>
                          <Progress value={project.totalMm ? (project.avanceMm / project.totalMm) * 100 : 0} />
                        </div>
                      </div>
                    ));
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeKey="dashboard" onLogout={() => alert('Cerrar sesión')}>
      {/* Vista de plantilla centrada */}
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full mx-auto max-w-3xl p-8">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-[#2f2b79] mb-4">Sección en Desarrollo</h1>
            <Button onClick={() => setActiveTab("resumen")} variant="outline">Volver</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

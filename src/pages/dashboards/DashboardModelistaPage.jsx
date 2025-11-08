"use client";

import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

export default function DashboardModelistaPage() {
  const [activeTab, setActiveTab] = useState("resumen");

  const mockData = [
    { actividad: "Diseño Casco", horas: 45, estado: "Completado" },
    { actividad: "Outfitting Eléctrico", horas: 32, estado: "En progreso" },
    { actividad: "Sistemas HVAC", horas: 28, estado: "En progreso" },
    { actividad: "Acabados Interiores", horas: 15, estado: "Bloqueado" },
  ];

  const mockProjects = [
    { id:1,proyecto:"Fragata F-110",swb:"SWB-001",actividad:"Diseño estructural del casco",horasInvertidas:45,avanceMm:850,totalMm:1200,estado:"En progreso"},
    { id:2,proyecto:"Patrullera CPV-46",swb:"SWB-002",actividad:"Outfitting eléctrico",horasInvertidas:32,avanceMm:650,totalMm:800,estado:"Completado"},
  ];

  const totalHoras = mockData.reduce((sum, item) => sum + item.horas, 0);
  const completadas = mockData.filter((item) => item.estado === "Completado").length;
  const enProgreso = mockData.filter((item) => item.estado === "En progreso").length;
  const bloqueadas = mockData.filter((item) => item.estado === "Bloqueado").length;

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
                    <p className="text-3xl font-bold text-[#2f2b79]">{totalHoras}</p>
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
                    <p className="text-3xl font-bold text-[#2f2b79]">{completadas}</p>
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
                    <p className="text-3xl font-bold text-[#2f2b79]">{enProgreso}</p>
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
                    <p className="text-3xl font-bold text-[#2f2b79]">{bloqueadas}</p>
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
                    <BarChart data={mockData}>
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
                  {mockProjects.map((project) => (
                    <div key={project.id} className="p-5 border rounded-xl bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#2f2b79]">{project.proyecto}</h4>
                        <Badge variant={getStatusVariant(project.estado)}>{project.estado}</Badge>
                      </div>

                      <p className="text-sm text-[#36418a] mb-2">{project.actividad}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-[#36418a]">
                          <span>Avance: {project.avanceMm}mm / {project.totalMm}mm</span>
                          <span>{Math.round((project.avanceMm / project.totalMm) * 100)}%</span>
                        </div>
                        <Progress value={(project.avanceMm / project.totalMm)*100} />
                      </div>
                    </div>
                  ))}
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

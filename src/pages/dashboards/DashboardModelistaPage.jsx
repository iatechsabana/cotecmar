"use client";

import { useState } from "react";
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
      <div className="min-h-screen w-full bg-gradient-to-b from-[#041C32] via-[#04293A] to-[#064663] px-10 py-10 text-white">

        <div className="flex items-center justify-between mb-10 w-full">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard Modelista</h1>
            <p className="text-white/60 text-sm">Vista general de actividades y proyectos asignados</p>
          </div>

          <Button onClick={() => setActiveTab("plantilla")} className="gap-2 bg-white text-black hover:bg-white/80">
            <Plus className="w-4 h-4" /> Nuevo Registro
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:shadow-xl transition">
            <CardContent className="p-6 flex gap-4 items-center">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalHoras}</p>
                <p className="text-xs opacity-70">Horas Totales</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:shadow-xl transition">
            <CardContent className="p-6 flex gap-4 items-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-300" />
              </div>
              <div>
                <p className="text-3xl font-bold">{completadas}</p>
                <p className="text-xs opacity-70">Completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:shadow-xl transition">
            <CardContent className="p-6 flex gap-4 items-center">
              <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <p className="text-3xl font-bold">{enProgreso}</p>
                <p className="text-xs opacity-70">En Progreso</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:shadow-xl transition">
            <CardContent className="p-6 flex gap-4 items-center">
              <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">{bloqueadas}</p>
                <p className="text-xs opacity-70">Bloqueadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts + Proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 w-full">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader>
              <CardTitle>Horas por Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="actividad" angle={-45} textAnchor="end" height={80} stroke="#fff"/>
                  <YAxis stroke="#fff"/>
                  <Tooltip />
                  <Bar dataKey="horas" fill="#FFFFFF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader>
              <CardTitle>Proyectos Activos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {mockProjects.map((project) => (
                <div key={project.id} className="p-5 border border-white/20 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{project.proyecto}</h4>
                    <Badge variant={getStatusVariant(project.estado)}>{project.estado}</Badge>
                  </div>

                  <p className="text-sm opacity-60 mb-2">{project.actividad}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
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
    )
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#04293A]">
      <h1 className="text-3xl font-bold mb-4">Sección en Desarrollo</h1>
      <Button onClick={() => setActiveTab("resumen")} variant="outline">Volver</Button>
    </div>
  )
}

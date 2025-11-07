import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Clock, TrendingUp, AlertTriangle, Settings } from "lucide-react";

const mockGlobalData = [
  { proyecto: "Fragata F-110", horasTotal: 1250, avancePromedio: 75, reprocesos: 8 },
  { proyecto: "Patrullera CPV-46", horasTotal: 890, avancePromedio: 92, reprocesos: 3 },
  { proyecto: "Corbeta ARC", horasTotal: 1450, avancePromedio: 45, reprocesos: 12 },
];

const curvaS = [
  { semana: "S1", planificado: 10, real: 8 },
  { semana: "S2", planificado: 25, real: 22 },
  { semana: "S3", planificado: 45, real: 38 },
  { semana: "S4", planificado: 65, real: 58 },
  { semana: "S5", planificado: 80, real: 75 },
  { semana: "S6", planificado: 95, real: 88 },
];

const estadosData = [
  { name: "Completadas", value: 45, color: "#22c55e" },
  { name: "En Progreso", value: 35, color: "#3b82f6" },
  { name: "Bloqueadas", value: 20, color: "#ef4444" },
];

export default function LiderDashboardPage() {
  const [activeTab, setActiveTab] = useState("global");

  const totalHoras = mockGlobalData.reduce((s, i) => s + i.horasTotal, 0);
  const promedioAvance = Math.round(
    mockGlobalData.reduce((s, i) => s + i.avancePromedio, 0) / mockGlobalData.length
  );
  const totalReprocesos = mockGlobalData.reduce((s, i) => s + i.reprocesos, 0);
  const totalProyectos = mockGlobalData.length;

  return (
    <MainLayout activeKey="dashboard" onLogout={() => alert("Cerrar sesión")}>
      {/* CONTENEDOR CENTRADO HORIZONTALMENTE */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl space-y-6 px-6 md:px-8">
          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2f2b79]">Dashboard Líder</h1>
              <p className="text-[#36418a]">Vista global de todos los proyectos</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("cgt")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2f2b79] text-[#2f2b79] hover:bg-[#e6eefc] transition-colors"
              >
                <Settings className="w-4 h-4" /> Metodología CGT
              </button>
              <button
                onClick={() => setActiveTab("reprocesos")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ef4444] text-[#ef4444] hover:bg-[#fbeaea] transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> SWBS Reprocesos
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                icon: <Users className="w-6 h-6 text-[#2f2b79]" />,
                value: totalProyectos,
                label: "Proyectos Activos",
                bg: "bg-[#e6eefc]",
              },
              {
                icon: <Clock className="w-6 h-6 text-blue-500" />,
                value: totalHoras.toLocaleString(),
                label: "Horas Totales",
                bg: "bg-blue-100",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-green-500" />,
                value: `${promedioAvance}%`,
                label: "Avance Promedio",
                bg: "bg-green-100",
              },
              {
                icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
                value: totalReprocesos,
                label: "Reprocesos",
                bg: "bg-red-100",
              },
            ].map((k, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-6 flex items-center gap-4 w-full"
              >
                <div
                  className={`w-12 h-12 ${k.bg} rounded-lg flex items-center justify-center`}
                >
                  {k.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2f2b79]">{k.value}</p>
                  <p className="text-sm text-[#36418a]">{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Curva S */}
            <div className="bg-white rounded-xl shadow p-6 w-full">
              <h2 className="text-lg font-semibold mb-4 text-[#2f2b79]">
                Curva S Acumulada
              </h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curvaS}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semana" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="planificado"
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      name="Planificado"
                    />
                    <Line
                      type="monotone"
                      dataKey="real"
                      stroke="#2f2b79"
                      strokeWidth={2}
                      name="Real"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Estados de Actividades */}
            <div className="bg-white rounded-xl shadow p-6 w-full">
              <h2 className="text-lg font-semibold mb-4 text-[#2f2b79]">
                Estados de Actividades
              </h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {estadosData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {estadosData.map((e) => (
                  <div key={e.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: e.color }}
                    />
                    <span className="text-sm">{e.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de proyectos */}
          <div className="bg-white rounded-xl shadow p-6 w-full">
            <h2 className="text-lg font-semibold mb-4 text-[#2f2b79]">
              Resumen de Proyectos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Proyecto</th>
                    <th className="text-left p-2">Horas Totales</th>
                    <th className="text-left p-2">Avance</th>
                    <th className="text-left p-2">Reprocesos</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGlobalData.map((p, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 font-medium">{p.proyecto}</td>
                      <td className="p-2">{p.horasTotal.toLocaleString()}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-28 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2f2b79]"
                              style={{ width: `${p.avancePromedio}%` }}
                            />
                          </div>
                          <span className="text-sm">{p.avancePromedio}%</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.reprocesos > 10
                              ? "bg-red-100 text-red-700"
                              : p.reprocesos > 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.reprocesos}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

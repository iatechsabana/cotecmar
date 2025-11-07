import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { TrendingUp, Clock, Users, AlertTriangle, Ruler, Repeat } from "lucide-react";

// Simulación de hook de KPIs (reemplaza con tu lógica real o importación)
function useKPIs({ bloque }) {
  // Datos simulados para el bloque
  return {
    hhPlan: 1200,
    hhReal: 950,
    hhDelta: 950 - 1200,
    avanceMMPlan: 100,
    avanceMMReal: 82,
    avanceMMDelta: 82 - 100,
    reprocesos: 4,
  };
}

const kpiCards = [
  {
    title: "HH Plan",
    icon: <Clock className="w-7 h-7 text-blue-500" />, color: "bg-blue-100", value: (k) => k.hhPlan.toFixed(2),
  },
  {
    title: "HH Real",
    icon: <Clock className="w-7 h-7 text-green-500" />, color: "bg-green-100", value: (k) => k.hhReal.toFixed(2),
  },
  {
    title: "Δ HH (Real - Plan)",
    icon: <TrendingUp className="w-7 h-7 text-yellow-500" />, color: "bg-yellow-100", value: (k) => k.hhDelta.toFixed(2),
  },
  {
    title: "% HH Ejecutado",
    icon: <TrendingUp className="w-7 h-7 text-indigo-500" />, color: "bg-indigo-100", value: (k) => (k.hhPlan > 0 ? ((k.hhReal / k.hhPlan) * 100).toFixed(1) + "%" : "0%"),
  },
  {
    title: "mm Plan",
    icon: <Ruler className="w-7 h-7 text-blue-400" />, color: "bg-blue-50", value: (k) => k.avanceMMPlan.toFixed(0),
  },
  {
    title: "mm Real",
    icon: <Ruler className="w-7 h-7 text-green-400" />, color: "bg-green-50", value: (k) => k.avanceMMReal.toFixed(0),
  },
  {
    title: "Δ mm",
    icon: <TrendingUp className="w-7 h-7 text-yellow-400" />, color: "bg-yellow-50", value: (k) => k.avanceMMDelta.toFixed(0),
  },
  {
    title: "Reprocesos reportados",
    icon: <Repeat className="w-7 h-7 text-red-500" />, color: "bg-red-100", value: (k) => k.reprocesos.toString(),
  },
];

function Card({ title, value, icon, color }) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl shadow bg-white border-t-4 ${color}`}>
      <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white shadow-inner border">
        {icon}
      </div>
      <div>
        <div className="text-xs text-[#36418a] font-semibold uppercase tracking-wide mb-1">{title}</div>
        <div className="text-2xl font-bold text-[#2f2b79]">{value}</div>
      </div>
    </div>
  );
}

export default function DashboardKPIsPage() {
  const [bloque] = useState("1110");
  const k = useKPIs({ bloque });

  return (
    <MainLayout activeKey="kpis" onLogout={() => alert('Cerrar sesión')}>
      <section className="max-w-7xl mx-auto space-y-8">
        <header className="mb-4">
          <h1 className="text-4xl font-extrabold text-[#2f2b79] mb-1">Dashboard KPIs</h1>
          <p className="text-lg text-[#36418a]">Indicadores clave de desempeño del bloque <span className="font-bold">{bloque}</span></p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {kpiCards.map((card) => (
            <Card key={card.title} title={card.title} value={card.value(k)} icon={card.icon} color={card.color} />
          ))}
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#2f2b79] mb-4">Descripción de KPIs</h2>
          <ul className="list-disc pl-6 space-y-2 text-[#36418a]">
            <li><b>HH Plan:</b> Horas hombre planificadas para el bloque.</li>
            <li><b>HH Real:</b> Horas hombre ejecutadas realmente.</li>
            <li><b>Δ HH (Real - Plan):</b> Diferencia entre horas reales y planificadas.</li>
            <li><b>% HH Ejecutado:</b> Porcentaje de avance de horas ejecutadas respecto al plan.</li>
            <li><b>mm Plan:</b> Metros medidos planificados.</li>
            <li><b>mm Real:</b> Metros medidos ejecutados realmente.</li>
            <li><b>Δ mm:</b> Diferencia entre metros reales y planificados.</li>
            <li><b>Reprocesos reportados:</b> Número de reprocesos identificados en el bloque.</li>
          </ul>
        </div>
      </section>
    </MainLayout>
  );
}

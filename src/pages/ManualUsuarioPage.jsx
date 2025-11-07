import MainLayout from "./layout/MainLayout";
import { BookOpen, Users, ClipboardList, BarChart3, Settings } from "lucide-react";

const sections = [
  {
    title: "Introducción al Sistema",
    description: "Conceptos básicos y objetivos del sistema de métricas de Cotecmar",
    icon: BookOpen,
    topics: ["Objetivos del sistema", "Roles y permisos", "Navegación básica"],
  },
  {
    title: "Gestión de Usuarios",
    description: "Administración de roles Modelista y Líder",
    icon: Users,
    topics: ["Roles y permisos", "Acceso a módulos", "Gestión de sesiones"],
  },
  {
    title: "Registro de Avances",
    description: "Cómo registrar avances en milímetros y gestionar reprocesos",
    icon: ClipboardList,
    topics: ["Registro de proyectos", "Medición en milímetros", "Gestión de reprocesos", "Estados de actividades"],
  },
  {
    title: "Dashboards y Reportes",
    description: "Interpretación de KPIs y visualizaciones",
    icon: BarChart3,
    topics: ["KPIs principales", "Curva S acumulada", "Análisis de reprocesos", "Ranking de sistemas"],
  },
  {
    title: "Metodología CGT",
    description: "Cálculos de diseño real vs estimado (solo Líderes)",
    icon: Settings,
    topics: ["Fórmulas CGT", "Factores de corrección", "Análisis comparativo", "Interpretación de resultados"],
  },
];

export default function ManualUsuarioPage() {
  return (
    <MainLayout activeKey="manual" onLogout={() => alert('Cerrar sesión')}>
      <section className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[#2f2b79]">Manual de Usuario</h1>
          <p className="text-[#36418a]">Guía completa para el uso del sistema de métricas de la División de Outfitting</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#e6eefc] rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#2f2b79]" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-[#2f2b79]">{section.title}</span>
                  </div>
                </div>
                <p className="text-sm text-[#36418a] mb-2">{section.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#2f2b79]">Temas incluidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {section.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-2 py-1 rounded-full text-xs bg-[#cbd8f9] text-[#2f2b79] font-medium">{topic}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Medición en Milímetros</h4>
            <p className="text-sm text-blue-800">
              El sistema utiliza mediciones en milímetros (mm) en lugar de porcentajes para mayor precisión en el seguimiento de avances de construcción naval.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Roles del Sistema</h4>
            <p className="text-sm text-green-800">
              <strong>Modelista:</strong> Registro de avances y reprocesos propios.<br />
              <strong>Líder:</strong> Vista global, metodología CGT y análisis de reprocesos.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Gestión de Reprocesos</h4>
            <p className="text-sm text-orange-800">
              Los reprocesos se vinculan automáticamente a los registros originales y se contabilizan en las métricas de eficiencia del proyecto.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

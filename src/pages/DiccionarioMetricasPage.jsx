import { useState } from "react";
import MainLayout from "./layout/MainLayout";
import { Search, TrendingUp, Clock, AlertTriangle, BarChart3, Target } from "lucide-react";

const metricas = [
  {
    termino: "CGT (Compensated Gross Tonnage)",
    definicion:
      "Medida estándar internacional que compensa el tonelaje bruto de un buque según su complejidad de construcción.",
    formula: "CGT = A × (GT^B) donde A y B son coeficientes empíricos",
    categoria: "Metodología",
    icon: Target,
    aplicacion: "Estimación de horas de construcción y comparación entre proyectos",
  },
  {
    termino: "Curva S Acumulada",
    definicion: "Representación gráfica del avance acumulado del proyecto a lo largo del tiempo.",
    formula: "Avance Acumulado (%) vs Tiempo",
    categoria: "Seguimiento",
    icon: TrendingUp,
    aplicacion: "Monitoreo del progreso del proyecto y detección de desviaciones",
  },
  {
    termino: "SWBS (Ship Work Breakdown Structure)",
    definicion: "Estructura jerárquica que descompone el trabajo de construcción naval en sistemas manejables.",
    formula: "Código alfanumérico: SWB-XXX",
    categoria: "Organización",
    icon: BarChart3,
    aplicacion: "Organización y seguimiento de actividades por sistema del buque",
  },
  {
    termino: "Horas de Reproceso",
    definicion: "Tiempo adicional invertido en corregir o rehacer trabajo previamente completado.",
    formula: "Horas Reproceso = Σ(Horas adicionales por corrección)",
    categoria: "Eficiencia",
    icon: Clock,
    aplicacion: "Medición de eficiencia y identificación de áreas de mejora",
  },
  {
    termino: "Avance en Milímetros",
    definicion: "Medición física del progreso de construcción expresada en unidades lineales.",
    formula: "Avance (mm) / Total Planificado (mm) × 100",
    categoria: "Medición",
    icon: Target,
    aplicacion: "Seguimiento preciso del avance físico de construcción",
  },
  {
    termino: "Factor de Cliente (CF)",
    definicion: "Coeficiente que ajusta la complejidad según los requerimientos específicos del cliente.",
    formula: "CF = Factor base × Multiplicadores de complejidad",
    categoria: "Metodología",
    icon: Target,
    aplicacion: "Ajuste de estimaciones según especificaciones del proyecto",
  },
  {
    termino: "Productividad Promedio (pp)",
    definicion: "Relación entre las horas reales invertidas y las horas estándar estimadas.",
    formula: "pp = Horas Reales / Horas Estándar",
    categoria: "Eficiencia",
    icon: TrendingUp,
    aplicacion: "Evaluación del rendimiento del equipo de trabajo",
  },
  {
    termino: "Ranking de Sistemas Críticos",
    definicion: "Clasificación de sistemas SWBS según su impacto en reprocesos y retrasos.",
    formula: "Puntuación = (Reprocesos × Peso) + (Horas Adicionales × Peso)",
    categoria: "Análisis",
    icon: AlertTriangle,
    aplicacion: "Priorización de atención y recursos en sistemas problemáticos",
  },
];

const categorias = ["Todas", "Metodología", "Seguimiento", "Organización", "Eficiencia", "Medición", "Análisis"];

export default function DiccionarioMetricasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredMetricas = metricas.filter((metrica) => {
    const matchesSearch =
      metrica.termino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      metrica.definicion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || metrica.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout activeKey="diccionario" onLogout={() => alert('Cerrar sesión')}>
      <section className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[#2f2b79]">Diccionario de Métricas</h1>
          <p className="text-[#36418a]">Definiciones y fórmulas de las métricas utilizadas en el sistema de outfitting</p>
        </header>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b3b8d0] w-4 h-4" />
            <input
              placeholder="Buscar métricas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 border rounded-lg w-full focus:ring-2 focus:ring-[#2f2b79] outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === categoria ? 'bg-[#2f2b79] text-white border-[#2f2b79]' : 'bg-white text-[#2f2b79] border-[#b3b8d0] hover:bg-[#e6eefc]'}`}
                onClick={() => setSelectedCategory(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
        {/* Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMetricas.map((metrica, index) => {
            const Icon = metrica.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#e6eefc] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#2f2b79]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-[#2f2b79]">{metrica.termino}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#cbd8f9] text-[#2f2b79] font-medium">{metrica.categoria}</span>
                    </div>
                    <p className="text-sm text-[#36418a]">{metrica.definicion}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-[#2f2b79]">Fórmula:</h4>
                    <code className="text-xs bg-[#f3f4f6] p-2 rounded block font-mono">{metrica.formula}</code>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-[#2f2b79]">Aplicación:</h4>
                    <p className="text-sm text-[#36418a]">{metrica.aplicacion}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredMetricas.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center border">
            <p className="text-[#b3b8d0]">No se encontraron métricas que coincidan con los filtros aplicados.</p>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

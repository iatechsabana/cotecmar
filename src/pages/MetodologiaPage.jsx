import MainLayout from "./layout/MainLayout";
import { FileText, Download, ExternalLink, Calculator, BarChart3, Settings } from "lucide-react";

const metodologias = [
    {
        titulo: "Metodología CGT (Compensated Gross Tonnage)",
        descripcion:
            "Estándar internacional para la estimación de horas de construcción naval basado en el tonelaje compensado.",
        categoria: "Estimación",
        icon: Calculator,
        acceso: "Líder",
        documentos: [
            { nombre: "Manual CGT v2.1.pdf", tipo: "PDF", tamaño: "2.3 MB" },
            { nombre: "Coeficientes CGT 2024.xlsx", tipo: "Excel", tamaño: "156 KB" },
        ],
        pasos: [
            "Obtener Gross Tonnage (GT) del buque",
            "Calcular peso de outfitting y lightship",
            "Aplicar coeficientes empíricos A y B",
            "Calcular CGT = A × (GT^B)",
            "Aplicar factor de cliente (CF)",
            "Estimar horas: HH = pp × CGT",
        ],
    },
    {
        titulo: "Metodología de Seguimiento de Avances",
        descripcion:
            "Sistema de medición en milímetros para el seguimiento preciso del progreso de construcción.",
        categoria: "Seguimiento",
        icon: BarChart3,
        acceso: "Todos",
        documentos: [
            { nombre: "Guía de Medición en MM.pdf", tipo: "PDF", tamaño: "1.8 MB" },
            { nombre: "Plantilla de Registro.xlsx", tipo: "Excel", tamaño: "245 KB" },
        ],
        pasos: [
            "Definir puntos de medición por SWBS",
            "Establecer línea base en milímetros",
            "Registrar avances periódicos",
            "Calcular porcentaje de completitud",
            "Actualizar curva S acumulada",
            "Generar reportes de progreso",
        ],
    },
    {
        titulo: "Metodología de Análisis de Reprocesos",
        descripcion:
            "Proceso sistemático para identificar, registrar y analizar reprocesos en la construcción naval.",
        categoria: "Calidad",
        icon: Settings,
        acceso: "Todos",
        documentos: [
            { nombre: "Análisis de Reprocesos v1.5.pdf", tipo: "PDF", tamaño: "3.1 MB" },
            { nombre: "Matriz de Causas.xlsx", tipo: "Excel", tamaño: "189 KB" },
        ],
        pasos: [
            "Identificar actividad con reproceso",
            "Registrar horas adicionales invertidas",
            "Documentar motivo del reproceso",
            "Vincular al registro original",
            "Actualizar métricas de eficiencia",
            "Generar plan de mejora",
        ],
    },
    {
        titulo: "Metodología SWBS (Ship Work Breakdown Structure)",
        descripcion:
            "Estructura jerárquica para la organización y codificación de actividades de construcción naval.",
        categoria: "Organización",
        icon: FileText,
        acceso: "Todos",
        documentos: [
            { nombre: "Estándar SWBS Cotecmar.pdf", tipo: "PDF", tamaño: "4.2 MB" },
            { nombre: "Códigos SWBS Actualizados.xlsx", tipo: "Excel", tamaño: "312 KB" },
        ],
        pasos: [
            "Definir sistemas principales del buque",
            "Asignar códigos SWBS jerárquicos",
            "Desglosar en subsistemas",
            "Asignar responsables por sistema",
            "Establecer dependencias",
            "Crear cronograma por SWBS",
        ],
    },
];

export default function MetodologiasPage() {
    return (
        <MainLayout activeKey="metodologias" onLogout={() => alert("Cerrar sesión")}>
            <section className="max-w-5xl mx-auto px-6 space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-[#2f2b79] text-center">Metodologías</h1>
                    <p className="text-[#36418a] text-center">
                        Procedimientos y estándares utilizados en la División de Outfitting de Cotecmar
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {metodologias.map((metodo, index) => {
                        const Icon = metodo.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-[#e6eefc] rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-[#2f2b79]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#2f2b79]">{metodo.titulo}</h2>
                                        <p className="text-sm text-[#36418a]">{metodo.categoria}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-[#36418a] mb-4">{metodo.descripcion}</p>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-[#2f2b79] mb-2">Pasos:</p>
                                    <ul className="space-y-2">
                                        {metodo.pasos.map((paso, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 bg-[#f4f7fe] p-2 rounded-lg border border-[#e2e7f6]"
                                            >
                                                <span className="w-6 h-6 flex items-center justify-center bg-[#2f2b79] text-white text-xs rounded-full flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm text-[#2f2b79]">{paso}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-[#2f2b79] mb-2">Documentos de referencia:</p>
                                    <div className="space-y-2">
                                        {metodo.documentos.map((doc, j) => (
                                            <div
                                                key={j}
                                                className="flex items-center justify-between p-2 bg-[#f9faff] rounded-lg border border-[#e6ebf9]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#2f2b79]" />
                                                    <div>
                                                        <p className="text-sm font-medium text-[#2f2b79]">{doc.nombre}</p>
                                                        <p className="text-xs text-[#36418a]">
                                                            {doc.tipo} • {doc.tamaño}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="text-[#2f2b79] text-xs font-medium flex items-center gap-1 hover:underline">
                                                    <Download className="w-3 h-3" /> Descargar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-3 pt-3 border-t border-[#e2e7f6]">
                                    <button className="text-[#2f2b79] text-sm font-medium flex items-center gap-2 hover:underline">
                                        <ExternalLink className="w-4 h-4" /> Ver Detalles
                                    </button>
                                    <button className="text-[#2f2b79] text-sm font-medium flex items-center gap-2 hover:underline">
                                        <Download className="w-4 h-4" /> Descargar Todo
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </MainLayout>
    );
}

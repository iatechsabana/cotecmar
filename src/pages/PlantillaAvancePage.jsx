"use client";
import React, { useState } from "react";
import MainLayout from "./layout/MainLayout";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const mockAvances = [
  {
    id: 1,
    proyecto: "Fragata F-110",
    swbs: "SWB-001",
    actividad: "Diseño estructural del casco",
    horasInvertidas: 45,
    avanceMm: 850,
    totalMm: 1200,
    estado: "En progreso",
    comentarios: "Avance según cronograma",
    fecha: "2024-01-15",
    reprocesos: [
      {
        id: 1,
        numero: 1,
        horasAdicionales: 8,
        motivo: "Corrección de medidas según especificaciones",
        fecha: "2024-01-20",
      },
    ],
  },
  {
    id: 2,
    proyecto: "Patrullera CPV-46",
    swbs: "SWB-002",
    actividad: "Outfitting eléctrico",
    horasInvertidas: 32,
    avanceMm: 650,
    totalMm: 800,
    estado: "Completado",
    comentarios: "Finalizado exitosamente",
    fecha: "2024-01-10",
    reprocesos: [],
  },
];

export default function PlantillaAvances({ user }) {
  const [avances, setAvances] = useState(mockAvances);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showReprocesoForm, setShowReprocesoForm] = useState(null);
  const [newAvance, setNewAvance] = useState({
    proyecto: "",
    swbs: "",
    actividad: "",
    horasInvertidas: "",
    avanceMm: "",
    totalMm: "",
    estado: "En progreso",
    comentarios: "",
  });
  const [newReproceso, setNewReproceso] = useState({
    horasAdicionales: "",
    motivo: "",
  });

  const handleSubmitAvance = (e) => {
    e.preventDefault();
    const avance = {
      id: Date.now(),
      ...newAvance,
      horasInvertidas: Number(newAvance.horasInvertidas),
      avanceMm: Number(newAvance.avanceMm),
      totalMm: Number(newAvance.totalMm),
      fecha: new Date().toISOString().split("T")[0],
      reprocesos: [],
    };
    setAvances([...avances, avance]);
    setNewAvance({
      proyecto: "",
      swbs: "",
      actividad: "",
      horasInvertidas: "",
      avanceMm: "",
      totalMm: "",
      estado: "En progreso",
      comentarios: "",
    });
    setShowNewForm(false);
  };

  const handleSubmitReproceso = (e, avanceId) => {
    e.preventDefault();
    const avance = avances.find((a) => a.id === avanceId);
    if (!avance) return;

    const reproceso = {
      id: Date.now(),
      numero: avance.reprocesos.length + 1,
      horasAdicionales: Number(newReproceso.horasAdicionales),
      motivo: newReproceso.motivo,
      fecha: new Date().toISOString().split("T")[0],
    };

    const updatedAvances = avances.map((a) =>
      a.id === avanceId
        ? {
          ...a,
          reprocesos: [...a.reprocesos, reproceso],
          horasInvertidas: a.horasInvertidas + reproceso.horasAdicionales,
        }
        : a
    );

    setAvances(updatedAvances);
    setNewReproceso({ horasAdicionales: "", motivo: "" });
    setShowReprocesoForm(null);
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case "Completado":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "En progreso":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Bloqueado":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (estado) => {
    switch (estado) {
      case "Completado":
        return "default";
      case "En progreso":
        return "secondary";
      case "Bloqueado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <MainLayout activeKey="avances" onLogout={() => alert("Cerrar sesión")}>
      <div className="w-full flex justify-center">
        <section className="w-full max-w-6xl mx-auto px-6 py-6 space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-[#2f2b79]">
              Plantilla de Avances
            </h1>
            <p className="text-[#36418a]">
              Registro de avances en milímetros y gestión de reprocesos
            </p>
          </header>

          {/* Botón de nuevo registro */}
          <div className="flex justify-end">
            <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-[#2f2b79] hover:bg-[#1f1c60] text-white shadow-md rounded-lg">
                  <Plus className="w-4 h-4" />
                  Nuevo Registro
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#cbd8f9] p-6">
                <DialogHeader className="mb-4 text-center border-b border-[#e2e7f6] pb-3">
                  <DialogTitle className="text-2xl font-bold text-[#2f2b79]">Nuevo Registro de Avance</DialogTitle>
                  <p className="text-sm text-[#36418a] mt-1">
                    Diligencia los datos para registrar un nuevo avance del proyecto
                  </p>
                </DialogHeader>

                <form onSubmit={handleSubmitAvance} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proyecto">Proyecto</Label>
                      <Input
                        id="proyecto"
                        value={newAvance.proyecto}
                        onChange={(e) => setNewAvance({ ...newAvance, proyecto: e.target.value })}
                        placeholder="Ej: Fragata F-110"
                        required
                        className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swbs">SWBS</Label>
                      <Input
                        id="swbs"
                        value={newAvance.swbs}
                        onChange={(e) => setNewAvance({ ...newAvance, swbs: e.target.value })}
                        placeholder="Ej: SWB-001"
                        required
                        className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actividad">Actividad / Tarea</Label>
                    <Input
                      id="actividad"
                      value={newAvance.actividad}
                      onChange={(e) => setNewAvance({ ...newAvance, actividad: e.target.value })}
                      placeholder="Descripción de la actividad"
                      required
                      className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="horas">Horas Invertidas</Label>
                      <Input
                        id="horas"
                        type="number"
                        value={newAvance.horasInvertidas}
                        onChange={(e) => setNewAvance({ ...newAvance, horasInvertidas: e.target.value })}
                        placeholder="0"
                        required
                        className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avance">Avance (mm)</Label>
                      <Input
                        id="avance"
                        type="number"
                        value={newAvance.avanceMm}
                        onChange={(e) => setNewAvance({ ...newAvance, avanceMm: e.target.value })}
                        placeholder="0"
                        required
                        className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total">Total (mm)</Label>
                      <Input
                        id="total"
                        type="number"
                        value={newAvance.totalMm}
                        onChange={(e) => setNewAvance({ ...newAvance, totalMm: e.target.value })}
                        placeholder="0"
                        required
                        className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={newAvance.estado}
                      onValueChange={(value) => setNewAvance({ ...newAvance, estado: value })}
                    >
                      <SelectTrigger className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                        <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios</Label>
                    <Textarea
                      id="comentarios"
                      value={newAvance.comentarios}
                      onChange={(e) => setNewAvance({ ...newAvance, comentarios: e.target.value })}
                      placeholder="Comentarios adicionales..."
                      className="border-[#cbd8f9] focus:ring-2 focus:ring-[#2f2b79]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e7f6] mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewForm(false)}
                      className="border-[#cbd8f9] text-[#2f2b79] hover:bg-[#f1f4ff]"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2f2b79] hover:bg-[#1f1c60] text-white shadow-md"
                    >
                      Guardar Registro
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

          </div>

          {/* Listado de avances */}
          <div className="space-y-4">
            {avances.map((avance) => (
              <Card
                key={avance.id}
                className="border border-[#cbd8f9] shadow hover:shadow-lg transition p-4 rounded-xl bg-white"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(avance.estado)}
                      <div>
                        <CardTitle className="text-[#2f2b79] text-lg">
                          {avance.proyecto}
                        </CardTitle>
                        <p className="text-sm text-[#36418a]">
                          {avance.swbs} • {avance.actividad}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(avance.estado)}>
                        {avance.estado}
                      </Badge>

                      <Dialog
                        open={showReprocesoForm === avance.id}
                        onOpenChange={(open) =>
                          setShowReprocesoForm(open ? avance.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 bg-[#e6eefc] text-[#2f2b79] hover:bg-[#d4e0fb]"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reproceso
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Agregar Reproceso</DialogTitle>
                          </DialogHeader>

                          <form
                            onSubmit={(e) =>
                              handleSubmitReproceso(e, avance.id)
                            }
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label>Horas Adicionales</Label>
                              <Input
                                type="number"
                                value={newReproceso.horasAdicionales}
                                onChange={(e) =>
                                  setNewReproceso({
                                    ...newReproceso,
                                    horasAdicionales: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Motivo del Reproceso</Label>
                              <Textarea
                                value={newReproceso.motivo}
                                onChange={(e) =>
                                  setNewReproceso({
                                    ...newReproceso,
                                    motivo: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowReprocesoForm(null)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                className="bg-[#2f2b79] hover:bg-[#1f1c60] text-white"
                              >
                                Agregar Reproceso
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-[#36418a]">Horas Invertidas</p>
                      <p className="text-lg font-semibold text-[#2f2b79]">
                        {avance.horasInvertidas}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#36418a]">Avance</p>
                      <p className="text-lg font-semibold text-[#2f2b79]">
                        {avance.avanceMm} / {avance.totalMm} mm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#36418a]">Progreso</p>
                      <p className="text-lg font-semibold text-[#2f2b79]">
                        {Math.round(
                          (avance.avanceMm / avance.totalMm) * 100
                        )}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#36418a]">Reprocesos</p>
                      <p className="text-lg font-semibold text-[#2f2b79]">
                        {avance.reprocesos.length}
                      </p>
                    </div>
                  </div>

                  {avance.comentarios && (
                    <div>
                      <p className="text-sm text-[#36418a] mb-1">Comentarios:</p>
                      <p className="text-sm text-[#2f2b79]">
                        {avance.comentarios}
                      </p>
                    </div>
                  )}

                  {avance.reprocesos.length > 0 && (
                    <div>
                      <p className="text-sm text-[#36418a] mb-2">Reprocesos:</p>
                      <div className="space-y-2">
                        {avance.reprocesos.map((reproceso) => (
                          <div
                            key={reproceso.id}
                            className="p-3 bg-[#f4f7fe] rounded-lg border border-[#e2e7f6]"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline">
                                Reproceso #{reproceso.numero}
                              </Badge>
                              <span className="text-sm text-[#36418a]">
                                {reproceso.horasAdicionales}h adicionales
                              </span>
                            </div>
                            <p className="text-sm text-[#2f2b79]">
                              {reproceso.motivo}
                            </p>
                            <p className="text-xs text-[#36418a] mt-1">
                              {reproceso.fecha}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

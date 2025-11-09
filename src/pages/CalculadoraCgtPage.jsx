"use client";

import { useState } from "react";
import MainLayout from "./layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Calculator } from "lucide-react";

const DEFAULT_FACTORS = {
  "Petrolero (Oil Tanker)": 0.45,
  "Granelero (Bulk Carrier)": 0.36,
  "Portacontenedores (Container Ship)": 0.60,
  "Gasero (LNG/LPG)": 0.73,
  "Pasajeros / Crucero": 1.90,
  "Carga General": 0.45,
  "Ferry Ro-Ro": 1.00,
  "Pesquero": 0.52,
  "Militar": 1.50,
  "Remolcador / Supply": 0.75,
};

export default function CgtCalculatorPage() {
  const [gt, setGt] = useState(0);
  const [shipType, setShipType] = useState(Object.keys(DEFAULT_FACTORS)[0]);
  const [customFactor, setCustomFactor] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [history, setHistory] = useState([]);

  const factor = useCustom && customFactor !== "" ? Number(customFactor) : DEFAULT_FACTORS[shipType] || 0;
  const cgt = Number(gt) > 0 ? Number(gt) * factor : 0;

  function handleCalculate() {
    const entry = {
      id: Date.now(),
      gt: Number(gt),
      shipType,
      factor,
      cgt: Number((Number(gt) * factor).toFixed(2)),
      date: new Date().toLocaleString(),
    };
    setHistory([entry, ...history].slice(0, 10));
  }

  function handleReset() {
    setGt(0);
    setCustomFactor("");
    setUseCustom(false);
  }

  return (
    <MainLayout activeKey="dashboard" onLogout={() => alert('Cerrar sesión')}>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl space-y-6 px-6 md:px-8 py-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2f2b79]">Calculadora CGT</h1>
              <p className="text-[#36418a] text-sm">Compensated Gross Tonnage — calcula CGT según el tipo de buque y factor.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setHistory([]); handleReset(); }}>Limpiar</Button>
              <Button variant="ghost" onClick={() => alert('Funcionalidad extra')} className="gap-2"><Plus className="w-4 h-4"/> Guardar</Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario */}
            <Card className="bg-white rounded-xl shadow p-4">
              <CardHeader>
                <CardTitle className="text-[#2f2b79]">Entrada de Datos</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo de buque</Label>
                  <Select value={shipType} onValueChange={(v) => setShipType(v)}>
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Selecciona tipo de buque" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(DEFAULT_FACTORS).map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gross Tonnage (GT)</Label>
                  <Input type="number" value={gt} onChange={(e) => setGt(e.target.value)} className="mt-2" />
                </div>

                <div>
                  <Label className="flex items-center gap-3">
                    <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="mr-2" /> Usar factor personalizado
                  </Label>

                  {useCustom ? (
                    <Input type="number" step="0.01" value={customFactor} onChange={(e) => setCustomFactor(e.target.value)} className="mt-2" placeholder="Ej. 0.60" />
                  ) : (
                    <p className="mt-2 text-sm text-[#36418a]">Factor seleccionado: <strong>{DEFAULT_FACTORS[shipType]}</strong></p>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button onClick={handleCalculate} className="flex-1"> <Calculator className="w-4 h-4 mr-2"/> Calcular CGT</Button>
                  <Button variant="outline" onClick={handleReset} className="flex-1">Reset</Button>
                </div>

                <div className="mt-4 bg-white rounded-md p-4 border">
                  <p className="text-sm text-[#36418a]">Resultado</p>
                  <h2 className="text-2xl font-bold text-[#2f2b79]">{cgt.toFixed(2)} CGT</h2>
                  <p className="text-xs text-[#6b7280]">GT × factor ({Number(gt)} × {factor})</p>
                </div>
              </CardContent>
            </Card>

            {/* Historia y ajustes */}
            <Card className="bg-white rounded-xl shadow p-4">
              <CardHeader>
                <CardTitle className="text-[#2f2b79]">Historial / Factores</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Tabla de factores (editable)</h4>
                  <p className="text-sm text-[#36418a]">Los valores mostrados provienen del estándar OCDE. Puedes usar un factor personalizado en la entrada.</p>

                  <div className="mt-3 grid grid-cols-1 gap-2 max-h-56 overflow-auto">
                    {Object.entries(DEFAULT_FACTORS).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm text-[#374151]">{k}</span>
                        <span className="text-sm font-medium text-[#111827]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Historial de cálculos</h4>

                  {history.length === 0 ? (
                    <p className="text-sm text-[#6b7280]">No hay cálculos recientes. Realiza una operación para que aparezca aquí.</p>
                  ) : (
                    <ul className="space-y-2 max-h-56 overflow-auto">
                      {history.map((h) => (
                        <li key={h.id} className="p-3 border rounded flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-[#2f2b79]">{h.shipType} — {h.gt} GT</div>
                            <div className="text-xs text-[#6b7280]">Factor: {h.factor} • Resultado: {h.cgt} CGT</div>
                          </div>
                          <div className="text-xs text-[#9ca3af]">{h.date}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setHistory([])} variant="ghost">Borrar historial</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

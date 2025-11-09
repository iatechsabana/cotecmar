"use client";
import MainLayout from "./layout/MainLayout";
import { useEffect, useMemo, useState } from "react";
import { getUsersByRole } from "../lib/userService";
import { addProductividadEvent, getProductividadEvents } from "../lib/firestoreService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const SISTEMAS = ["HVAC", "PIPE", "CBTR"];

export default function ProductividadPage() {
  const [eventos, setEventos] = useState([]);
  const [modelistas, setModelistas] = useState([]);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    operario: "Modelista 1",
    bloque: "B1110",
    sistema: "HVAC",
    tipo: "PRODUCTIVO",
    duracionMin: 60,
  });

  useEffect(() => {
    const raw = localStorage.getItem("prod_eventos");
    if (raw) setEventos(JSON.parse(raw));
  }, []);

  // Cargar eventos guardados en Firestore y fusionarlos con los locales
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await getProductividadEvents();

        // construir mapa de firmas remotas para evitar duplicados
        const sigRemote = new Set(remote.map(r => `${r.fecha}|${r.operario}|${r.bloque}|${r.sistema}|${r.tipo}|${r.duracionMin}`));

        const raw = localStorage.getItem("prod_eventos");
        const local = raw ? JSON.parse(raw) : [];

        // incluir remotos (marcados como synced)
        const merged = remote.map(r => ({ ...r, synced: true }));

        // añadir locales que no estén en remotos (por firma)
        for (const l of local) {
          const sig = `${l.fecha}|${l.operario}|${l.bloque}|${l.sistema}|${l.tipo}|${l.duracionMin}`;
          if (l.pendingSync) {
            // intentar subir los pendientes
            try {
              const newId = await addProductividadEvent({ ...l, createdAt: l.createdAt || undefined });
              merged.unshift({ ...l, id: newId, synced: true });
            } catch (err) {
              console.warn('No se pudo subir evento pendiente:', err);
              merged.unshift(l);
            }
          } else if (!sigRemote.has(sig)) {
            merged.unshift(l);
          }
        }

        if (!mounted) return;
        // ordenar por fecha/createdAt si es posible
        merged.sort((a, b) => {
          if (a.createdAt && b.createdAt) return (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0);
          return b.fecha.localeCompare(a.fecha);
        });

        setEventos(merged);
        localStorage.setItem("prod_eventos", JSON.stringify(merged));
      } catch (err) {
        console.error('Error cargando eventos remotos:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Cargar modelistas desde Firestore
  useEffect(() => {
    let mounted = true;
    getUsersByRole('modelista')
      .then((list) => {
        if (!mounted) return;
        setModelistas(list || []);
        if (list && list.length && !form.operario) {
          setForm((s) => ({ ...s, operario: list[0].nombre || '' }));
        }
      })
      .catch((err) => console.error('Error cargando modelistas:', err));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("prod_eventos", JSON.stringify(eventos));
  }, [eventos]);

  function addEvento(e) {
    e.preventDefault();
    if (!form.fecha || !form.operario || !form.sistema || !form.tipo || !form.duracionMin) return;

    const ev = {
      id: crypto.randomUUID(),
      fecha: form.fecha,
      operario: form.operario,
      bloque: form.bloque || "",
      sistema: form.sistema,
      tipo: form.tipo,
      duracionMin: Number(form.duracionMin),
    };

    // Optimistic UI: añadir localmente y luego enviar a Firestore
    const tempId = ev.id;
    setEventos((prev) => [ev, ...prev]);

    (async () => {
      try {
        const remoteId = await addProductividadEvent(ev);
        // Reemplazar id temporal por id remoto
        setEventos((prev) => prev.map(it => it.id === tempId ? { ...it, id: remoteId, synced: true } : it));
      } catch (err) {
        console.error('Error guardando evento en Firestore:', err);
        // Marcar como pendiente de sync
        setEventos((prev) => prev.map(it => it.id === tempId ? { ...it, pendingSync: true } : it));
      }
    })();
  }

  function reset() {
    if (window.confirm("¿Borrar todos los eventos mock?")) {
      setEventos([]);
      localStorage.removeItem("prod_eventos");
    }
  }

  // Agrupar por operario/día
  const porOperarioDia = useMemo(() => {
    const map = new Map();
    for (const ev of eventos) {
      const key = `${ev.operario}|${ev.fecha}`;
      const o = map.get(key) || { tpr: 0, pnp: 0, tm: 0, rw: 0, otros: 0, total: 0 };

      if (ev.tipo === "PRODUCTIVO") o.tpr += ev.duracionMin;
      else if (ev.tipo === "PNP") o.pnp += ev.duracionMin;
      else if (ev.tipo === "TM") o.tm += ev.duracionMin;
      else if (ev.tipo === "RW") o.rw += ev.duracionMin;
      else o.otros += ev.duracionMin;

      o.total += ev.duracionMin;
      map.set(key, o);
    }
    return map;
  }, [eventos]);

  // Productividad promedio por operario
  const porOperario = useMemo(() => {
    const acc = new Map();
    for (const [k, v] of porOperarioDia) {
      const [operario] = k.split("|");
      const r = acc.get(operario) || { dias: 0, tpr: 0, pnp: 0, tm: 0, rw: 0, td: 0 };
      r.dias += 1;
      r.tpr += v.tpr;
      r.pnp += v.pnp;
      r.tm += v.tm;
      r.rw += v.rw;
      r.td += v.total;
      acc.set(operario, r);
    }

    return [...acc.entries()]
      .map(([operario, r]) => ({
        operario,
        dias: r.dias,
        tpr: r.tpr,
        td: r.td,
        pctProd: r.td > 0 ? (r.tpr / r.td) * 100 : 0,
        pctPNP: r.td > 0 ? (r.pnp / r.td) * 100 : 0,
        pctTM: r.td > 0 ? (r.tm / r.td) * 100 : 0,
        pctRW: r.td > 0 ? (r.rw / r.td) * 100 : 0,
      }))
      .sort((a, b) => a.operario.localeCompare(b.operario));
  }, [porOperarioDia]);

  // Matriz Bloque × Sistema (min productivos)
  const matriz = useMemo(() => {
    const bloques = new Set();
    const m = new Map(); // key bloque|sistema
    for (const ev of eventos) {
      if (ev.tipo !== "PRODUCTIVO") continue;
      const b = ev.bloque || "-";
      bloques.add(b);
      const key = `${b}|${ev.sistema}`;
      m.set(key, (m.get(key) || 0) + ev.duracionMin);
    }
    return { bloques: [...bloques].sort(), map: m };
  }, [eventos]);

  return (
    <MainLayout activeKey="productividad">
      <section className="max-w-5xl mx-auto px-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[#2f2b79]">Productividad</h1>
          <p className="text-[#36418a]">Registra eventos y observa % productivo por operario y matriz Bloque × Sistema</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-[#2f2b79] mb-4">Registrar evento</h2>
          <form onSubmit={addEvento} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={form.fecha} onChange={(e) => setForm(s => ({ ...s, fecha: e.target.value }))} className="mt-2" />
            </div>

            <div>
              <Label>Operario</Label>
              {modelistas && modelistas.length ? (
                <Select value={form.operario} onValueChange={(v) => setForm(s => ({ ...s, operario: v }))}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelistas.map((u) => (
                      <SelectItem key={u.id} value={u.nombre}>{u.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={form.operario} onChange={(e) => setForm(s => ({ ...s, operario: e.target.value }))} className="mt-2" />
              )}
            </div>

            <div>
              <Label>Bloque</Label>
              <Input value={form.bloque || ""} onChange={(e) => setForm(s => ({ ...s, bloque: e.target.value }))} className="mt-2" />
            </div>

            <div>
              <Label>Sistema</Label>
              <Select value={form.sistema} onValueChange={(v) => setForm(s => ({ ...s, sistema: v }))}>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SISTEMAS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm(s => ({ ...s, tipo: v }))}>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['PRODUCTIVO', 'PNP', 'TM', 'RW', 'ADM', 'CAP_NP'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duración (min)</Label>
              <Input type="number" min={1} value={form.duracionMin} onChange={(e) => setForm(s => ({ ...s, duracionMin: Number(e.target.value) }))} className="mt-2" />
            </div>

            <div>
              <Button className="w-full">Agregar</Button>
            </div>
          </form>
          <div className="text-right mt-3">
            <Button variant="ghost" size="sm" onClick={reset} className="text-red-600">Borrar todo (mock)</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <h2 className="text-lg font-medium">Productividad promedio por operario</h2>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <Th>Operario</Th>
                  <Th className="text-right">Días</Th>
                  <Th className="text-right">TPR (min)</Th>
                  <Th className="text-right">TD (min)</Th>
                  <Th className="text-right">% Productivo</Th>
                  <Th className="text-right">% PNP</Th>
                  <Th className="text-right">% TM</Th>
                  <Th className="text-right">% RW</Th>
                </tr>
              </thead>
              <tbody>
                {porOperario.map(r => (
                  <tr key={r.operario} className="border-t">
                    <Td>{r.operario}</Td>
                    <Td className="text-right">{r.dias}</Td>
                    <Td className="text-right">{fmt(r.tpr)}</Td>
                    <Td className="text-right">{fmt(r.td)}</Td>
                    <Td className="text-right">{fmt(r.pctProd, 1)}%</Td>
                    <Td className="text-right">{fmt(r.pctPNP, 1)}%</Td>
                    <Td className="text-right">{fmt(r.pctTM, 1)}%</Td>
                    <Td className="text-right">{fmt(r.pctRW, 1)}%</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <h2 className="text-lg font-medium">Bloque × Sistema (min PRODUCTIVOS)</h2>
          <div className="overflow-x-auto mt-3">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Bloque</Th>
                  {SISTEMAS.map((s) => (
                    <Th key={s} className="text-right">{s}</Th>
                  ))}
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {matriz.bloques.map((b) => {
                  const total = SISTEMAS.reduce((sum, s) => {
                    const key = `${b}|${s}`;
                    return sum + (matriz.map.get(key) || 0);
                  }, 0);
                  return (
                    <tr key={b} className="border-t">
                      <Td>{b}</Td>
                      {SISTEMAS.map((s) => {
                        const v = matriz.map.get(`${b}|${s}`) || 0;
                        return <Td key={s} className="text-right">{fmt(v)}</Td>;
                      })}
                      <Td className="text-right font-medium">{fmt(total)}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">Solo se incluyen eventos tipo PRODUCTIVO.</p>
        </div>
        </div>
      </section>
    </MainLayout>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}

function fmt(n, dec = 0) {
  return n.toLocaleString(undefined, { maximumFractionDigits: dec, minimumFractionDigits: dec });
}

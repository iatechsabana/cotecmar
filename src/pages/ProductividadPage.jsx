"use client";
import { useEffect, useMemo, useState } from "react";

type Evento = {
  id: string;
  fecha: string;
  operario: string;
  bloque?: string;
  sistema: string;
  tipo: "PRODUCTIVO" | "PNP" | "TM" | "RW" | "ADM" | "CAP_NP";
  duracionMin: number;
}

const SISTEMAS = ["HVAC", "PIPE", "CBTR"];

export default function ProductividadPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState<Partial<Evento>>({
    fecha: new Date().toISOString().slice(0,10),
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
  useEffect(() => {
    localStorage.setItem("prod_eventos", JSON.stringify(eventos));
  }, [eventos]);

  function addEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fecha || !form.operario || !form.sistema || !form.tipo || !form.duracionMin) return;
    const ev: Evento = {
      id: crypto.randomUUID(),
      fecha: form.fecha,
      operario: form.operario,
      bloque: form.bloque || "",
      sistema: form.sistema as string,
      tipo: form.tipo as Evento["tipo"],
      duracionMin: Number(form.duracionMin),
    };
    setEventos((prev) => [ev, ...prev]);
  }

  function reset() {
    if (confirm("¿Borrar todos los eventos mock?")) {
      setEventos([]);
      localStorage.removeItem("prod_eventos");
    }
  }

  // Agrupar por operario/día
  const porOperarioDia = useMemo(() => {
    const map = new Map<string, { tpr:number; pnp:number; tm:number; rw:number; otros:number; total:number }>();
    for (const ev of eventos) {
  const key = `${ev.operario}|${ev.fecha}`;
  const o = map.get(key) ?? { tpr:0, pnp:0, tm:0, rw:0, otros:0, total:0 };
  if (ev.tipo === "PRODUCTIVO") o.tpr += ev.duracionMin;
  else if (ev.tipo === "PNP") o.pnp += ev.duracionMin;
  else if (ev.tipo === "TM")  o.tm  += ev.duracionMin;
  else if (ev.tipo === "RW")  o.rw  += ev.duracionMin;
  else o.otros += ev.duracionMin;
  o.total += ev.duracionMin;
  map.set(key, o);
    }
    return map;
  }, [eventos]);

  // Productividad promedio por operario
  const porOperario = useMemo(() => {
    const acc = new Map<string, { dias:number; tpr:number; pnp:number; tm:number; rw:number; td:number }>();
    for (const [k, v] of porOperarioDia) {
      const [operario] = k.split("|");
      const r = acc.get(operario) ?? { dias:0, tpr:0, pnp:0, tm:0, rw:0, td:0 };
      r.dias += 1; r.tpr += v.tpr; r.pnp += v.pnp; r.tm += v.tm; r.rw += v.rw; r.td += v.total;
      acc.set(operario, r);
    }
    return [...acc.entries()].map(([operario, r]) => ({
  operario,
  dias: r.dias,
  tpr: r.tpr,
  td: r.td,
  pctProd: r.td>0 ? (r.tpr/r.td)*100 : 0,
  pctPNP:  r.td>0 ? (r.pnp/r.td)*100 : 0,
      pctTM:   r.td>0 ? (r.tm /r.td)*100 : 0,
      pctRW:   r.td>0 ? (r.rw /r.td)*100 : 0,
    })).sort((a,b)=>a.operario.localeCompare(b.operario));
  }, [porOperarioDia]);

  // Matriz Bloque × Sistema (min productivos)
  const matriz = useMemo(() => {
  const bloques = new Set<string>();
  const m = new Map<string, number>(); // key bloque|sistema
  for (const ev of eventos) {
  if (ev.tipo !== "PRODUCTIVO") continue;
  const b = ev.bloque || "-";
  bloques.add(b);
      const key = `${b}|${ev.sistema}`;
      m.set(key, (m.get(key) ?? 0) + ev.duracionMin);
    }
    return { bloques: [...bloques].sort(), map: m };
  }, [eventos]);

  return (
    <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">Productividad — Operario y Bloque/Sistema (mock)</h1>
        <p className="text-sm text-gray-600">Registra eventos y observa % productivo por operario y matriz Bloque × Sistema. Sin backend.</p>
      </header>

      <section className="rounded-2xl border p-4 space-y-3 bg-white">
        <h2 className="text-lg font-medium">Registrar evento</h2>
        <form onSubmit={addEvento} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
          <Input label="Fecha" type="date" value={form.fecha} onChange={v=>setForm(s=>({...s, fecha:v}))}/>
          <Input label="Operario" value={form.operario} onChange={v=>setForm(s=>({...s, operario:v}))}/>
          <Input label="Bloque" value={form.bloque || ""} onChange={v=>setForm(s=>({...s, bloque:v}))}/>
          <Select label="Sistema" value={form.sistema as string} onChange={v=>setForm(s=>({...s, sistema:v}))} options={SISTEMAS}/>
    <Select label="Tipo" value={form.tipo as string} onChange={v=>setForm(s=>({...s, tipo: v as any}))}
      options={["PRODUCTIVO","PNP","TM","RW","ADM","CAP_NP"]}/>
    <Input label="Duración (min)" type="number" min={1} value={String(form.duracionMin ?? "")}
                 onChange={v=>setForm(s=>({...s, duracionMin: Number(v)}))}/>
          <div><button className="px-4 py-2 rounded-xl border hover:shadow w-full">Agregar</button></div>
        </form>
        <div className="text-right">
          <button onClick={reset} className="text-sm text-red-600 underline">Borrar todo (mock)</button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Productividad promedio por operario</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white">
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
        {porOperario.map(r=>(<tr key={r.operario} className="border-t">
          <Td>{r.operario}</Td>
          <Td className="text-right">{r.dias}</Td>
                  <Td className="text-right">{fmt(r.tpr)}</Td>
                  <Td className="text-right">{fmt(r.td)}</Td>
                  <Td className="text-right">{fmt(r.pctProd,1)}%</Td>
                  <Td className="text-right">{fmt(r.pctPNP,1)}%</Td>
                  <Td className="text-right">{fmt(r.pctTM,1)}%</Td>
                  <Td className="text-right">{fmt(r.pctRW,1)}%</Td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Bloque × Sistema (min PRODUCTIVOS)</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Bloque</Th>
                {SISTEMAS.map(s => <Th key={s} className="text-right">{s}</Th>)}
                <Th className="text-right">Total</Th>
              </tr>
            </thead>
            <tbody>
              {matriz.bloques.map(b=>{
                const total = SISTEMAS.reduce((sum, s)=>{
                  const key = `${b}|${s}`;
                  return sum + (matriz.map.get(key) ?? 0);
                }, 0);
                return (
                  <tr key={b} className="border-t">
                    <Td>{b}</Td>
                    {SISTEMAS.map(s=>{
                      const v = matriz.map.get(`${b}|${s}`) ?? 0;
                      return <Td key={s} className="text-right">{fmt(v)}</Td>;
                    })}
                    <Td className="text-right font-medium">{fmt(total)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">Solo se incluyen eventos tipo PRODUCTIVO.</p>
      </section>
    </main>
  );
}

function Input({label, value, onChange, type="text", min}:{label:string;value:any;onChange:(v:string)=>void;type?:string;min?:number}) {
  return (
    <label className="text-sm">
      {label}
      <input className="mt-1 block w-full border rounded-lg px-2 py-1" value={value ?? ""} type={type}
             min={min} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}
function Select({label, value, onChange, options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}) {
  return (
    <label className="text-sm">
      {label}
      <select className="mt-1 block w-full border rounded-lg px-2 py-1" value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(op=><option key={op} value={op}>{op}</option>)}
      </select>
    </label>
  );
}
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function fmt(n:number, dec=0){ return n.toLocaleString(undefined,{maximumFractionDigits:dec, minimumFractionDigits:dec}); }

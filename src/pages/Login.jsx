import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🚀 Si ya hay usuario logueado, redirigir automáticamente
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      if (usuario.rol === "lider") navigate("/dashboard-lider");
      else if (usuario.rol === "modelista") navigate("/dashboard-kpis");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Simulación de validación (reemplaza por llamada real a tu backend)
    let usuario = null;

    if (email === "lider@gmail.com" && password === "1234") {
      usuario = { nombre: "Líder Outfitting", rol: "lider" };
      navigate("/dashboard-lider");
    } else if (email === "modelista@gmail.com" && password === "1234") {
      usuario = { nombre: "Modelista Naval", rol: "modelista" };
      navigate("/dashboard-kpis");
    } else {
      alert("Usuario o contraseña incorrecta");
      return;
    }

    // 🔹 Guardamos el usuario en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#dce7ff] to-[#8caeff] font-[Inter]">
      {/* 🌊 Fondo marino */}
      <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-[#0e1d4f] overflow-hidden">
        <svg
          className="absolute bottom-0 w-[200%] h-52 animate-waveSlow opacity-80"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#142760"
            d="M0,256L48,250.7C96,245,192,235,288,208C384,181,480,139,576,149.3C672,160,768,224,864,240C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128V320H0Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-[200%] h-52 animate-waveMedium opacity-90"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#1a2b6f"
            d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,197.3L1440,181.3V320H0Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-[200%] h-48 animate-waveFast opacity-95"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.35"
            d="M0,256L60,240C120,224,240,192,360,186.7C480,181,600,203,720,213.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128V320H0Z"
          ></path>
        </svg>
      </div>

      {/* 🚢 Barco */}
      <div className="absolute bottom-[8vh] right-[5%] flex flex-col items-center z-[5]">
        <img
          src="/ship_login.png"
          alt="Barco Cotecmar"
          className="w-[900px] md:w-[1100px] max-h-[88vh] object-contain animate-shipFloat drop-shadow-[0_15px_40px_rgba(0,0,0,0.45)]"
        />
        <img
          src="/ship_login.png"
          alt="Reflejo barco"
          className="absolute bottom-[-110px] right-0 w-[880px] md:w-[1060px] opacity-25 blur-[2px] scale-y-[-1] object-contain pointer-events-none"
        />
      </div>

      {/* 🧾 Formulario */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full md:w-[45%] md:pl-[6%]">
        <div className="flex flex-col items-center mb-12">
          <img
            src="/logo_cotecmar.png"
            alt="Logo Cotecmar"
            className="w-44 md:w-52 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
          />
        </div>

        <div className="w-full max-w-md bg-white/25 backdrop-blur-md border border-white/40 shadow-2xl rounded-3xl p-10">
          <h1 className="text-center text-3xl md:text-4xl font-bold text-[#0f1e4d] mb-10 tracking-wide">
            INICIAR SESIÓN
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-[#3b56d6] w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@cotecmar.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white/60 text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-[#3b56d6] w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#b9c5ff]/70 bg-white/60 text-[#1a2b6f] placeholder:text-[#7a8bba] focus:outline-none focus:ring-2 focus:ring-[#3b56d6] focus:bg-white transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="relative w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1a2b6f] to-[#2a3c9f] text-white font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden group"
            >
              <span className="relative z-10">ENTRAR</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <p className="text-center text-sm mt-3">
              <a
                href="#"
                className="text-[#3b56d6] hover:underline hover:text-[#0f1e4d] transition-colors"
              >
                ¿Olvidó su contraseña?
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* 🌊 Animaciones */}
      <style>{`
        @keyframes shipFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-0.3deg); }
          50% { transform: translateY(4px) rotate(0.3deg); }
          75% { transform: translateY(-6px) rotate(-0.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes waveFast { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes waveMedium { 0% { transform: translateX(0); } 100% { transform: translateX(-35%); } }
        @keyframes waveSlow { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
        .animate-waveFast { animation: waveFast 5s linear infinite; }
        .animate-waveMedium { animation: waveMedium 9s linear infinite; }
        .animate-waveSlow { animation: waveSlow 14s linear infinite; }
        .animate-shipFloat { animation: shipFloat 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

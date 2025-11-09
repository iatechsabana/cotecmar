import { FiLogOut } from "react-icons/fi";
import { MdCalculate, MdDashboard, MdShowChart, MdFormatListBulleted, MdMenuBook, MdSchool, MdBook } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { signOut as firebaseSignOut } from "../../lib/authService";
import { useAuth } from "../../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard },
  { key: "productividad", label: "Productividad", path: "/productividad", icon: MdShowChart },
  { key: "calculadora", label: "Calculadora CGT", path: "/calculadora-cgt", icon: MdCalculate },
  { key: "avances", label: "Plantilla Avances", path: "/plantilla-avances", icon: MdFormatListBulleted },
  { key: "manual", label: "Manual de Usuario", path: "/manual-usuario", icon: MdMenuBook },
  { key: "metodologias", label: "Metodologías", path: "/metodologias", icon: MdSchool },
  { key: "diccionario", label: "Diccionario de Métricas", path: "/diccionario-metricas", icon: MdBook },
];

export default function MainLayout({ children, onLogout, activeKey }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active key from location if activeKey not provided
  const currentPath = location?.pathname || '/';
  let computedActive = activeKey || null;
  if (!computedActive) {
    if (currentPath.startsWith('/dashboard-')) computedActive = 'dashboard';
    else {
      const found = menuItems.find((m) => m.path === currentPath);
      computedActive = found ? found.key : null;
    }
  }
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#cbd8f9] to-[#dfe8fb] w-full overflow-hidden">
      {/* Sidebar fijo */}
      <aside className="w-80 md:w-100 bg-[#23215a] bg-opacity-95 flex flex-col items-center py-6 shadow-2xl h-screen fixed left-0 top-0 z-20">
        <div className="flex flex-col items-center w-full mb-8">
          <img
            src="/logo_cotecmar.png"
            alt="COTECMAR logo"
            className="w-16 md:w-32 h-auto mx-auto mb-2 drop-shadow-xl rounded-xl bg-white p-1"
            style={{ objectFit: "contain" }}
          />
          <span className="hidden md:block text-[#cbd8f9] font-bold text-lg tracking-wide text-center">
            COTECMAR
          </span>
        </div>

        <nav className="flex-1 w-full">
          <ul className="space-y-2 px-2 md:px-4">
            {menuItems
              .filter((item) => {
                // Solo mostrar Productividad si el usuario es líder
                if (item.key === 'productividad' && user?.rol !== 'lider') return false;
                return true;
              })
              .map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full flex items-center px-3 md:px-4 py-3 rounded-lg transition-colors font-semibold text-left border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#cbd8f9] shadow-sm 
                    ${computedActive === item.key ? "bg-[#23215a] text-white border-[#cbd8f9]" : "text-bg-[#23215a] hover:bg-[#2f2b79] hover:text-white"}`}
                  onClick={() => {
                    // Special handling for dashboard: navigate according to user role
                    if (item.key === 'dashboard') {
                      if (user?.rol === 'lider') navigate('/dashboard-lider');
                      else if (user?.rol === 'modelista') navigate('/dashboard-modelista');
                      else navigate('/dashboard-kpis');
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon ? (() => {
                    const Icon = item.icon;
                    const isActive = computedActive === item.key;
                    return <Icon className={`mr-3 ${isActive ? 'text-white' : 'text-[#cbd8f9]'}`} />
                  })() : null}
                  <span className="truncate text-base md:text-lg tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={async () => {
            try {
              await firebaseSignOut();
              // Si se pasó un callback adicional, llamarlo después del signOut
              if (typeof onLogout === 'function') onLogout();
              // Redirigir al login (ruta raíz en este proyecto)
              window.location.href = '/';
            } catch (err) {
              console.error('Error cerrando sesión:', err);
              // Aún así intentar llamar al callback si existe
              if (typeof onLogout === 'function') onLogout();
            }
          }}
          className="mt-8 flex items-center gap-2 text-[#cbd8f9] hover:text-white hover:bg-[#b91c1c] px-4 py-2 rounded-lg transition-colors mb-2 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#ef4444] shadow-sm font-semibold text-base md:text-lg"
          style={{ backgroundColor: "#23215a" }}
        >
          <FiLogOut className="text-xl" />
          <span className="hidden md:inline">Salir</span>
        </button>
      </aside>

      {/* Main content: dejamos espacio con margin-left igual al ancho del sidebar */}
      <div className="flex-1 flex flex-col min-h-screen ml-20 md:ml-56 w-full">
        {/* Header fijo */}
        <header className="h-16 bg-[#2f2b79] bg-opacity-90 flex items-center px-4 md:px-8 shadow-md w-full fixed top-0 left-80 md:left-100 right-0 z-10">
            <div className="flex-1">
              <h1 className="text-white text-lg md:text-2xl font-semibold tracking-wide">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {user?.nombre ? (
                <div className="hidden md:flex items-center gap-3 mr-2">
                  <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-sm font-bold text-[#1e293b]">{user.nombre.charAt(0).toUpperCase()}</div>
                  <div className="text-sm text-[#0f1724]">{user.nombre}</div>
                </div>
              ) : null}
            </div>
        </header>

        {/* Main area: mt-16 para no quedar debajo del header.
            Nota: usar px-0 para que el contenido use TODO el ancho disponible. */}
        <main className="flex-1 mt-16 px-0 md:px-4 py-4 md:py-8 w-full overflow-auto w-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

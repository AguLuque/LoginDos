import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiurl from "../config/Const";

// ---------------------- UTILIDADES ----------------------

const getJugadorImage = (idJugador) => {
  try {
    return `/src/assets/jugadores/${idJugador}.png`;
  } catch {
    return "/src/assets/jugadores/default.jpg";
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 'N/A';
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  // Ajustar si aún no cumplió años este año
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};


// ---------------------- COMPONENTES ----------------------

const JugadorCard = ({ jugador }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-xs bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Imagen del jugador */}
      <div className="relative w-full h-56 flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden rounded-t-xl">
        {!imgError ? (
          <img
            src={getJugadorImage(jugador.IdJugador)}
            alt={`${jugador.Nombre} ${jugador.Apellido}`}
            className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-5xl font-bold">
            {jugador.Nombre?.charAt(0)}
            {jugador.Apellido?.charAt(0)}
          </div>
        )}

        {/* Etiqueta de ranking */}
        <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-sm">
          #{jugador.Ranking}
        </div>
      </div>

      {/* Información del jugador */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
          {jugador.Nombre} {jugador.Apellido}
        </h3>

        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium text-gray-700">Gmail:</span> {jugador.Gmail || "Sin correo"}</p>
          <p><span className="font-medium text-gray-700">Tel:</span> {jugador.Telefono || "Sin teléfono"}</p>
          <p><span className="font-medium text-gray-700">Edad:</span> {calcularEdad(jugador.FechaNacimiento)} años</p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 text-right">
          <span className="text-sm text-gray-500">Ranking:</span>{" "}
          <span className="text-lg font-semibold text-gray-800">{jugador.Ranking}</span>
        </div>
      </div>
    </div>

  );
};

// Card de partido
const PartidoCard = ({ partido }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <div className="flex justify-between mb-3">
      <span className="text-sm text-gray-500">{formatearFecha(partido.Fecha)}</span>
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${partido.Estado === "completado"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
          }`}
      >
        {partido.Estado || 'Pendiente'}
      </span>
    </div>
    <div className="text-lg font-semibold text-gray-800">
      {partido.ParejaUno} 🆚 {partido.ParejaDos}
    </div>
    <div className="mt-3 text-sm text-gray-600">
      <p> {partido.Cancha || 'Por definir'}</p>
      <p> {partido.Torneo || 'Sin torneo'}</p>
      <p> {partido.HoraInicio || '--:--'} - {partido.HoraFin || '--:--'}</p>
      <p> Fase: {partido.Fase || 'N/A'} | Zona {partido.Zona || 'N/A'}</p>
    </div>
  </div>
);

// Card de torneo
const TorneoCard = ({ torneo }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-xl font-bold text-purple-700 mb-2">{torneo.Nombre}</h3>
    <p className="text-gray-600"> Estado: {torneo.Estado}</p>
    <p className="text-gray-600 mt-2"> Máx Parejas: {torneo.MaxParejas}</p>
    {torneo.Reglamento && (
      <p className="text-xs text-gray-400 mt-2 truncate">📋 {torneo.Reglamento}</p>
    )}
  </div>
);

// ---------------------- DASHBOARD PRINCIPAL ----------------------

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [activeTab, setActiveTab] = useState("jugadores");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //


  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);


  const fetchData = async () => {
    try {
      const [statsRes, jugadoresRes, partidosRes, torneosRes] = await Promise.all([
        fetch(`${apiurl}/api/dashboard/stats`),
        fetch(`${apiurl}/api/dashboard/jugadores`),
        fetch(`${apiurl}/api/dashboard/partidos`),
        fetch(`${apiurl}/api/dashboard/torneos`),
      ]);

      const statsData = await statsRes.json();
      const jugadoresData = await jugadoresRes.json();
      const partidosData = await partidosRes.json();
      const torneosData = await torneosRes.json();

      console.log('Stats:', statsData);
      console.log('Jugadores:', jugadoresData);
      console.log('Partidos:', partidosData);
      console.log('Torneos:', torneosData);

      if (statsData.success) setStats(statsData.data);
      if (jugadoresData.success) setJugadores(jugadoresData.data || []);
      if (partidosData.success) setPartidos(partidosData.data || []);
      if (torneosData.success) setTorneos(torneosData.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </div>
    );

  // ---------------------- RENDER PRINCIPAL ----------------------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900"> Dashboard Torneos 2025</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hola, {user?.nombre || "Invitado"}</span>
            <button
              onClick={logout} o
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>

          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas CLICKEABLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Jugadores"
            value={stats?.totalJugadores}
            color="blue"
            onClick={() => setActiveTab("jugadores")}
            active={activeTab === "jugadores"}
          />
          <StatCard
            label="Total Partidos"
            value={stats?.totalPartidos}
            color="green"
            onClick={() => setActiveTab("partidos")}
            active={activeTab === "partidos"}
          />
          <StatCard
            label="Total Torneos"
            value={stats?.totalTorneos}
            color="purple"
            onClick={() => setActiveTab("torneos")}
            active={activeTab === "torneos"}
          />
        </div>

        {/* Secciones dinámicas */}
        {activeTab === "jugadores" && (
          <Section title="Jugadores Registrados">
            {jugadores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jugadores.map((jugador) => (
                  <JugadorCard key={jugador.IdJugador} jugador={jugador} />
                ))}
              </div>
            ) : (
              <EmptyState mensaje="No hay jugadores registrados." />
            )}
          </Section>
        )}

        {activeTab === "partidos" && (
          <Section title="Partidos Recientes">
            {partidos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {partidos.map((partido) => (
                  <PartidoCard key={partido.IdPartido} partido={partido} />
                ))}
              </div>
            ) : (
              <EmptyState mensaje="No hay partidos registrados." />
            )}
          </Section>
        )}

        {activeTab === "torneos" && (
          <Section title="Torneos Activos">
            {torneos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {torneos.map((torneo) => (
                  <TorneoCard key={torneo.IdTorneo} torneo={torneo} />
                ))}
              </div>
            ) : (
              <EmptyState mensaje="No hay torneos registrados." />
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

// ---------------------- COMPONENTES AUXILIARES ----------------------

const StatCard = ({ label, value, color, onClick, active }) => {
  const colorClasses = {
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      activeBg: 'bg-blue-100'
    },
    green: {
      border: 'border-green-500',
      text: 'text-green-600',
      bg: 'bg-green-50',
      activeBg: 'bg-green-100'
    },
    purple: {
      border: 'border-purple-500',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      activeBg: 'bg-purple-100'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`
        ${active ? colors.activeBg : 'bg-white'} 
        p-6 rounded-lg shadow-lg border-t-4 ${colors.border}
        cursor-pointer transform transition-all duration-200 
        hover:scale-105 hover:shadow-xl
        ${active ? 'ring-4 ring-opacity-50 ring-' + color + '-300' : ''}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500 mb-2">{label}</div>
          <div className={`text-3xl font-bold ${colors.text}`}>
            {value || 0}
          </div>
        </div>
        <div className={`p-3 rounded-full ${colors.bg}`}>
          {color === 'blue' && (
            <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {color === 'green' && (
            <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          )}
          {color === 'purple' && (
            <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          )}
        </div>
      </div>
      {active && (
        <div className="mt-3 text-xs text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Viendo ahora
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
    {children}
  </div>
);

const EmptyState = ({ mensaje }) => (
  <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p className="text-lg">{mensaje}</p>
  </div>
);
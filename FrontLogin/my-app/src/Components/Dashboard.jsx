import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiurl from "../config/Const";

// UTILIDADES 

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

const calcularedad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "N/A";
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

// MODAL DETALLE JUGADOR 

const ModalDetalleJugador = ({ jugador, onClose, partidos, torneos }) => {
  const [imgError, setImgError] = useState(false);

  if (!jugador) return null;

  const partidosJugador = partidos.filter(
    (p) =>
      p.ParejaUno?.toLowerCase().includes(jugador.Nombre.toLowerCase()) ||
      p.ParejaUno?.toLowerCase().includes(jugador.Apellido.toLowerCase()) ||
      p.ParejaDos?.toLowerCase().includes(jugador.Nombre.toLowerCase()) ||
      p.ParejaDos?.toLowerCase().includes(jugador.Apellido.toLowerCase())
  );

  const torneosJugador = torneos.filter((t) =>
    partidosJugador.some((p) => p.Torneo === t.Nombre)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-500 text-white p-6 rounded-t-2xl flex justify-between items-start shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full overflow-hidden flex items-center justify-center">
              {!imgError ? (
                <img
                  src={getJugadorImage(jugador.IdJugador)}
                  alt={`${jugador.Nombre} ${jugador.Apellido}`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-black-600 text-4xl font-bold">
                  {jugador.Nombre?.charAt(0)}
                  {jugador.Apellido?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">
                {jugador.Nombre} {jugador.Apellido}
              </h2>
              <div className="flex gap-3">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  #{jugador.Ranking}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {calcularedad(jugador.FechaNacimiento)} años
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-circle btn-ghost text-white">
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Info Personal */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><b>Email:</b> {jugador.Gmail || "Sin correo"}</p>
              <p><b>Teléfono:</b> {jugador.Telefono || "Sin teléfono"}</p>
              <p><b>Fecha Nac.:</b> {formatearFecha(jugador.FechaNacimiento)}</p>
              <p><b>Ranking:</b> #{jugador.Ranking}</p>
            </div>
          </div>

          {/* Partidos */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Partidos ({partidosJugador.length})
            </h3>
            {partidosJugador.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {partidosJugador.map((p) => (
                  <div key={p.IdPartido} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${p.Estado === "completado"
                          ? "bg-blue-100 text-blue-700"
                          : p.Estado === "en juego"
                            ? "bg-blue-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {p.Estado || 'Pendiente'}
                      </span>
                    </div>
                    <p className="font-bold mt-1">{p.ParejaUno}  {p.ParejaDos}</p>
                    <p className="text-sm mt-1"> {p.Cancha || "Por definir"}</p>
                    <p className="text-sm"> {p.Torneo || "Sin torneo"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay partidos registrados.</p>
            )}
          </div>

          {/* Torneos */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Torneos ({torneosJugador.length})
            </h3>
            {torneosJugador.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {torneosJugador.map((t) => (
                  <div
                    key={t.IdTorneo}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <h4 className="font-bold text-black-700 mb-1">{t.Nombre}</h4>
                    <p> Estado: {t.Estado}</p>
                    <p> Máx Parejas: {t.MaxParejas}</p>
                    {t.Reglamento && (
                      <p className="text-xs text-gray-500 truncate">📋 {t.Reglamento}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay torneos registrados.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 p-4 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};


// COMPONENTES DE TARJETAS

const JugadorCard = ({ jugador, onClick }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      onClick={() => onClick(jugador)}
      className="max-w-xs bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer"
    >
      <div className="relative w-full h-56 flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden rounded-t-xl">
        {!imgError ? (
          <img
            src={getJugadorImage(jugador.IdJugador)}
            alt={`${jugador.Nombre} ${jugador.Apellido}`}
            className="h-full w-auto object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center text-gray-400 text-5xl font-bold">
            {jugador.Nombre?.charAt(0)}{jugador.Apellido?.charAt(0)}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-sm">
          #{jugador.Ranking}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{jugador.Nombre} {jugador.Apellido}</h3>
        <p className="text-sm text-gray-600"><b>Edad:</b> {calcularedad(jugador.FechaNacimiento)} años</p>
        <p className="h4-xs text-blue-600 font-medium mt-2">Click para ver más detalles</p>
      </div>
    </div>
  );
};

const PartidoCard = ({ partido }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <div className="flex justify-between mb-3">
      <span className="text-sm text-gray-500">{formatearFecha(partido.Fecha)}</span>
      <span
        className={`text-xs font-bold px-2 py-1 rounded ${partido.Estado === "completado"
          ? "bg-blue-100 text-blue-700"
          : "bg-blue-100 text-green-700"
          }`}
      >
        {partido.Estado || 'Pendiente'}
      </span>
    </div>
    <div className="text-lg font-semibold text-gray-800">
      {partido.ParejaUno} VS {partido.ParejaDos}
    </div>
    <div className="mt-3 text-sm text-gray-600">
      <p> {partido.Cancha || 'Por definir'}</p>
      <p> {partido.Torneo || 'Sin torneo'}</p>
      <p> {partido.HoraInicio || '--:--'} - {partido.HoraFin || '--:--'}</p>
      <p> Fase: {partido.Fase || 'N/A'} | Zona {partido.Zona || 'N/A'}</p>
    </div>
  </div>
);

const TorneoCard = ({ torneo }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-xl font-bold text-black-700 mb-2">{torneo.Nombre}</h3>
    <p className="text-gray-600"> Estado: {torneo.Estado}</p>
    <p className="text-gray-600 mt-2"> Máx Parejas: {torneo.MaxParejas}</p>
    {torneo.Reglamento && (
      <p className="text-xs text-gray-400 mt-2 truncate">📋 {torneo.Reglamento}</p>
    )}
  </div>
);
// DASHBOARD PRINCIPAL

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [activeTab, setActiveTab] = useState("jugadores");
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // redirección si no hay sesión iniciada
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  // Filtrado en tiempo real
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        const filtrados = jugadores.filter((j) =>
          `${j.Nombre} ${j.Apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setJugadoresFiltrados(filtrados);
      } else {
        setJugadoresFiltrados(jugadores);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, jugadores]);

  const fetchData = async () => {
    try {
      const [s, j, p, t] = await Promise.all([
        fetch(`${apiurl}/api/dashboard/stats`),
        fetch(`${apiurl}/api/dashboard/jugadores`),
        fetch(`${apiurl}/api/dashboard/partidos`),
        fetch(`${apiurl}/api/dashboard/torneos`),
      ]);

      const statsData = await s.json();
      const jugadoresData = await j.json();
      const partidosData = await p.json();
      const torneosData = await t.json();

      if (statsData.success) setStats(statsData.data);
      if (jugadoresData.success) {
        setJugadores(jugadoresData.data || []);
        setJugadoresFiltrados(jugadoresData.data || []);
      }
      if (partidosData.success) setPartidos(partidosData.data || []);
      if (torneosData.success) setTorneos(torneosData.data || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <span className="loading loading-spinner loading-lg text-black-600"></span>
      </div>
    );

  //RENDER PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modal Detalle Jugador */}
      {jugadorSeleccionado && (
        <ModalDetalleJugador
          jugador={jugadorSeleccionado}
          onClose={() => setJugadorSeleccionado(null)}
          partidos={partidos}
          torneos={torneos}
        />
      )}
      {/* HEADER */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo + Título */}
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="Logo A3SET"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Torneos Nueva Temporada
            </h1>
          </div>

          {/* Usuario + Botón */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hola, {user?.nombre || "Invitado"}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
                />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas clickeables */}
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
            color="blue"
            onClick={() => setActiveTab("partidos")}
            active={activeTab === "partidos"}
          />
          <StatCard
            label="Total Torneos"
            value={stats?.totalTorneos}
            color="blue"
            onClick={() => setActiveTab("torneos")}
            active={activeTab === "torneos"}
          />
        </div>

        {activeTab === "jugadores" && (
          <Section title="Jugadores Registrados">

            <div className="mb-6">
              <div className="w-full max-w-md mb-6">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 opacity-50"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>

                  <input
                    type="text"
                    placeholder="Buscar jugador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full focus:outline-none"
                  />
                </label>

                {searchTerm && (
                  <label className="label">
                    <span className="label-text-alt text-gray-600">
                      {jugadoresFiltrados.length} resultado(s)
                    </span>
                  </label>
                )}
              </div>

            </div>

            {jugadoresFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {jugadoresFiltrados.map((j) => (
                  <JugadorCard
                    key={j.IdJugador}
                    jugador={j}
                    onClick={setJugadorSeleccionado}
                  />
                ))}
              </div>
            ) : (
              <EmptyState mensaje="No se encontraron jugadores." />
            )}
          </Section>
        )}

        {activeTab === "partidos" && (
          <Section title="Partidos Registrados">
            {partidos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {partidos.map((p) => (
                  <PartidoCard key={p.IdPartido} partido={p} />
                ))}
              </div>
            ) : (
              <EmptyState mensaje="No hay partidos registrados." />
            )}
          </Section>
        )}

        {activeTab === "torneos" && (
          <Section title="Torneos Disponibles">
            {torneos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {torneos.map((t) => (
                  <TorneoCard key={t.IdTorneo} torneo={t} />
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

//COMPONENTES AUXILIARES

const StatCard = ({ label, value, color, onClick, active }) => {
  const colors = {
    blue: "from-blue-100 to-blue-50 text-blue-700 border-blue-500",
  }[color];

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${colors} p-6 rounded-xl border-2 cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${active ? "ring-4 ring-offset-2 ring-blue-300" : ""
        }`}
    >
      <h3 className="text-sm font-bold text-gray-700">{label}</h3>
      <p className="text-3xl font-bold">{value || 0}</p>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
    {children}
  </section>
);

const EmptyState = ({ mensaje }) => (
  <div className="bg-white p-10 rounded-xl text-center shadow">
    <svg
      className="mx-auto h-12 w-12 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
      />
    </svg>
    <p className="text-gray-500 text-lg">{mensaje}</p>
  </div>
);

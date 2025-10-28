import pool from "../config/db.js";

export const getDashboardStats = async () => {
  const [rows] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM jugador) AS totalJugadores,
      (SELECT COUNT(*) FROM partido) AS totalPartidos,
      (SELECT COUNT(*) FROM torneo) AS totalTorneos
  `);
  return rows[0];
};

export const getUltimosJugadores = async (limit = 30) => {
  const [rows] = await pool.query(`
    SELECT 
      IdJugador, 
      Nombre, 
      Apellido, 
      Gmail, 
      Telefono, 
      FechaNacimiento, 
      Ranking
    FROM jugador
    ORDER BY Ranking ASC
    LIMIT ?;
  `, [limit]);
  return rows;
};

export const getPartidos = async (limit = 30) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.IdPartido,
        h.Fecha AS Fecha,
        h.HoraInicio AS HoraInicio,
        h.HoraFin AS HoraFin,
        p.Estadop AS Estado,
        CONCAT(j1.Nombre, ' ', j1.Apellido, ' / ', j2.Nombre, ' ', j2.Apellido) AS ParejaUno,
        CONCAT(j3.Nombre, ' ', j3.Apellido, ' / ', j4.Nombre, ' ', j4.Apellido) AS ParejaDos,
        t.Nombret AS Torneo,
        c.Nombrecancha AS Cancha,
        f.Nombrefase AS Fase,
        z.Numzona AS Zona
      FROM partido p
      LEFT JOIN pareja pa1 ON p.IdParejauno = pa1.IdPareja
      LEFT JOIN pareja pa2 ON p.IdParejados = pa2.IdPareja
      LEFT JOIN jugador j1 ON pa1.IdJugadoruno = j1.IdJugador
      LEFT JOIN jugador j2 ON pa1.IdJugadordos = j2.IdJugador
      LEFT JOIN jugador j3 ON pa2.IdJugadoruno = j3.IdJugador
      LEFT JOIN jugador j4 ON pa2.IdJugadordos = j4.IdJugador
      LEFT JOIN torneo t ON p.IdTorneo = t.IdTorneo
      LEFT JOIN horario h ON p.IdHorario = h.IdHorario
      LEFT JOIN cancha c ON p.IdCancha = c.IdCancha
      LEFT JOIN fase f ON p.IdFase = f.IdFase
      LEFT JOIN zona z ON p.IdZona = z.IdZona
      WHERE h.Fecha IS NOT NULL
      ORDER BY h.Fecha DESC, h.HoraInicio DESC
      LIMIT ?;
    `, [limit]);

    return rows;
  } catch (error) {
    console.error('Error en getPartidos:', error);
    throw error;
  }
};

export const getTorneos = async (limit = 30) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        IdTorneo,
        IdCategoria,
        Nombret AS Nombre,
        Maxparejas AS MaxParejas,
        Estado,
        Reglamento
      FROM torneo
      ORDER BY IdTorneo DESC
      LIMIT ?;
    `, [limit]);
    return rows;
  } catch (error) {
    console.error('Error en getTorneos:', error);
    throw error;
  }
};

export const getStats = getDashboardStats;
export const getPartidosRecientes = getPartidos;

// Partidos ganados por jugador (procedimiento almacenado)
export const getPartidosGanadosPorJugador = async (nombre) => {
  try {
    const [rows] = await pool.query(
      'CALL ObtenerPartidosGanadosPorJugador(?)',
      [nombre]
    );
    return rows[0];
  } catch (error) {
    console.error('Error en getPartidosGanadosPorJugador:', error);
    throw error;
  }
};

// Buscar jugador por nombre
export const getJugadorPorNombre = async (nombre) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        IdJugador, 
        Nombre, 
        Apellido, 
        Gmail, 
        Telefono, 
        FechaNacimiento, 
        Ranking
      FROM jugador
      WHERE Nombre LIKE ? OR Apellido LIKE ?
      ORDER BY Ranking ASC;
    `, [`%${nombre}%`, `%${nombre}%`]);
    return rows;
  } catch (error) {
    console.error('Error en getJugadorPorNombre:', error);
    throw error;
  }
};
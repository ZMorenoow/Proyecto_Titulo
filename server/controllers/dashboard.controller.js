import db from '../configs/db.js';

// Obtener reservas por estado
export const getReservasPorEstado = async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT e.tipo_estado AS estado, COUNT(r.id_reserva) AS total
            FROM reservas r
            JOIN estados e ON r.estado = e.id_estado
            GROUP BY e.tipo_estado
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reservas por estado:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener pagos por mes
export const getPagosPorMes = async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT 
                DATE_FORMAT(p.fecha_pago, '%M %Y') AS mes, 
                SUM(p.monto) AS total
            FROM pagos p
            GROUP BY DATE_FORMAT(p.fecha_pago, '%M %Y')
            ORDER BY DATE_FORMAT(p.fecha_pago, '%Y-%m')
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pagos por mes:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener servicios más solicitados
export const getServiciosSolicitados = async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT s.nombre_servicio AS servicio, COUNT(c.id_contratacion) AS total
            FROM contratacion c
            JOIN servicios s ON c.id_servicio = s.id_servicio
            GROUP BY s.nombre_servicio
            ORDER BY total DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener servicios más solicitados:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener KPIs
export const getKPIs = async (req, res) => {
    try {
        const connection = await db();
        const [ingresos] = await connection.execute(`SELECT SUM(monto) AS ingresosTotales FROM pagos`);
        const [reservas] = await connection.execute(`SELECT COUNT(*) AS totalReservas FROM reservas`);
        const [canceladas] = await connection.execute(`SELECT COUNT(*) AS canceladas FROM reservas WHERE estado = 3`);
        const [valoraciones] = await connection.execute(`SELECT AVG(calificacion) AS valoracionesPromedio FROM valoracion`);

        const tasaCancelacion = reservas[0].totalReservas
            ? (canceladas[0].canceladas / reservas[0].totalReservas) * 100
            : 0;

        res.json({
            ingresosTotales: ingresos[0].ingresosTotales || 0,
            totalReservas: reservas[0].totalReservas || 0,
            tasaCancelacion: tasaCancelacion.toFixed(2) || 0,
            valoracionesPromedio: valoraciones[0].valoracionesPromedio || 0,
        });
    } catch (error) {
        console.error('Error al obtener KPIs:', error);
        res.status(500).json({ error: 'Error al obtener KPIs' });
    }
};

// Obtener comentarios recientes
export const getComentariosRecientes = async (req, res) => {
    try {
        const connection = await db();
        const [comentarios] = await connection.execute(`
            SELECT u.nombre AS cliente, v.comentario AS texto
            FROM valoracion v
            JOIN usuario u ON v.id_usuario = u.id_usuario
            ORDER BY v.fecha DESC
            LIMIT 5
        `);
        res.json(comentarios);
    } catch (error) {
        console.error('Error al obtener comentarios recientes:', error);
        res.status(500).json({ error: 'Error al obtener comentarios recientes' });
    }
};

// Obtener ingresos por intervalo
export const getIngresosPorIntervalo = async (req, res) => {
    const { intervalo } = req.query; // "semana", "mes", "año"
    let intervaloSQL = "YEAR(p.fecha_pago)";
    if (intervalo === "semana") intervaloSQL = "WEEK(p.fecha_pago)";
    if (intervalo === "mes") intervaloSQL = "MONTH(p.fecha_pago)";

    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT ${intervaloSQL} AS intervalo, SUM(p.monto) AS total
            FROM pagos p
            GROUP BY ${intervaloSQL}
            ORDER BY intervalo
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener ingresos por intervalo:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener reservas por categoría
export const getReservasPorCategoria = async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT s.nombre_servicio AS categoria, COUNT(r.id_reserva) AS total
            FROM reservas r
            JOIN servicios s ON r.id_servicio = s.id_servicio
            GROUP BY s.nombre_servicio
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reservas por categoría:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener reservas activas
export const getReservasActivas = async (req, res) => {
    try {
        const connection = await db();
        const [rows] = await connection.execute(`
            SELECT COUNT(*) AS reservasActivas
            FROM reservas
            WHERE estado IN (1, 2) // Pendiente o En progreso
        `);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener reservas activas:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

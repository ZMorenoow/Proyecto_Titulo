import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyecto_titulo'
});

passport.use(new GoogleStrategy({
  clientID: "1015729815292-26kiihmdpnn10el5qv6ci7t4dc6i0e0e.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuario WHERE google_id = ?',
      [profile.id]
    );

    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    const [result] = await pool.query(
      `INSERT INTO usuario (nombre_cliente, correo_cliente, google_id, direccion_cliente, numero_cliente, id_rol)
       VALUES (?, ?, ?, '', '', 2)`,
      [profile.displayName, profile.emails[0].value, profile.id]
    );

    const newUser = {
      id_cliente: result.insertId,
      nombre_cliente: profile.displayName,
      correo_cliente: profile.emails[0].value,
      google_id: profile.id,
      direccion_cliente: '',
      numero_cliente: '',
      id_rol: 2,
    };

    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id_cliente);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Usuario WHERE id_cliente = ?',
      [id]
    );

    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export { passport };
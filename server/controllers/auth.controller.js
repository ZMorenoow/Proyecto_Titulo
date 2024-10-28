import jwt from 'jsonwebtoken'
import passport from 'passport';


const googleLogin = (req, res) => {
    const accessToken = jwt.sign({ id: req.user.id_cliente, email: req.user.correo_cliente, rol: req.user.id_rol },"1q2w3e4r5t6y7u8i9o0p!@$%^&*_+QWERTYUIOP|:<>?asdfghjklzxcvbnmASDFGHJKLZXCVBNM",{ expiresIn: '8h' });
    res.status(200).json({ message: 'Login exitoso con Google', accessToken });
};

const googleLoginRedirect = passport.authenticate('google', { failureRedirect: '/login' });

export {googleLogin,googleLoginRedirect};

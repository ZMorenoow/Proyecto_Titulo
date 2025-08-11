# 🧽 Watch & Wash

**Sistema inteligente de reserva de servicios de limpieza con cotización automatizada por IA**

Una plataforma web moderna que revoluciona la forma de contratar servicios de limpieza, utilizando inteligencia artificial para generar cotizaciones precisas basadas en las características específicas de cada trabajo.

## 🚀 Características Principales

- **Cotización Inteligente**: Integración con Google Gemini AI para calcular automáticamente costos basados en dimensiones, texturas y tiempo de uso
- **Geolocalización**: Mapa interactivo que muestra sucursales cercanas al usuario
- **Generación de PDF**: Reportes automáticos con detalles del servicio y costos totales
- **Autenticación Segura**: Sistema completo con verificación por email y protección JWT
- **Pagos Integrados**: Pasarela de pago con PayPal y MercadoPago
- **Gestión de Usuarios**: Diferenciación entre personas naturales y empresas

## 🛠️ Stack Tecnológico

**Frontend**
- React 18 + Vite
- JavaScript/JSX
- CSS3 con diseño responsivo

**Backend**
- Node.js + Express
- JWT para autenticación
- Cookies seguras para sesiones

**Integraciones**
- Google Gemini API (IA para cotizaciones)
- PayPal SDK
- MercadoPago API
- Geolocalización HTML5
- Generación de PDF

## 🎯 Funcionalidades Clave

### Sistema de Cotización IA
La aplicación utiliza Google Gemini para analizar:
- Tipo de superficie (pisos, alfombras, muebles,etc)
- Dimensiones del área a limpiar
- Material y textura
- Tiempo de uso y nivel de suciedad

### Seguridad y Autenticación
- Verificación obligatoria de email
- Tokens JWT para sesiones seguras
- Protección de datos con cookies httpOnly
- Validación de ubicación del usuario

### Experiencia de Usuario
- Interfaz intuitiva y responsive
- Mapa interactivo con sucursales
- Generación automática de presupuestos en PDF
- Proceso de pago simplificado

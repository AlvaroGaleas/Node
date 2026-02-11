// src/main.js - Versión corregida
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración de la sesión
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./infraestructura/persistencia/mysql/config/database');

app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_temporal',
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'infraestructura/web/vistas'));

// Rutas
const administradorRoutes = require('./infraestructura/web/rutas/administradorRoutes');
const mercadoRoutes = require('./infraestructura/web/rutas/mercadoRoutes');
const reporteRoutes = require('./infraestructura/web/rutas/reporteRoutes');

app.use('/admin', administradorRoutes);
app.use('/mercado', mercadoRoutes);
app.use('/reportes', reporteRoutes);

app.get('/', (req, res) => {
    res.redirect('/admin/login');
});

// Sincronizar bases de datos
const inicializarDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos MySQL sincronizada');
        
        // Conectar MongoDB
        require('./infraestructura/persistencia/mongodb/config/connection');
    } catch (error) {
        console.error('Error al sincronizar base de datos:', error);
    }
};

inicializarDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
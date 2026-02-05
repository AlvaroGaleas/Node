import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// --- CONFIGURACIONES ---
import { connectMongoDB } from './infrastructure/config/mongo.js';
import { connectMySQL } from './infrastructure/config/sequelize.js';
import { specs } from './infrastructure/config/swagger.js';

// --- CLASES: PUESTOS ---
import { MySQLPuestoRepository } from './infrastructure/database/MySQLPuestoRepository.js';
import { PuestoService } from './application/services/PuestoService.js';
import { PuestoController } from './infrastructure/server/PuestoController.js';
import { crearPuestoRouter } from './infrastructure/routes/puestoRoutes.js';

// --- CLASES: USUARIOS ---
import { MySQLUsuarioRepository } from './infrastructure/database/MySQLUsuarioRepository.js';
import { UsuarioService } from './application/services/UsuarioService.js';
import { UsuarioController } from './infrastructure/server/UsuarioController.js';
import { crearUsuarioRouter } from './infrastructure/routes/usuarioRoutes.js';

// --- CLASES: SUSCRIPCIONES ---
import { MySQLSuscripcionRepository } from './infrastructure/database/MySQLSuscripcionRepository.js';
import { SuscripcionService } from './application/services/SuscripcionService.js';
import { SuscripcionController } from './infrastructure/server/SuscripcionController.js';
import { crearSuscripcionRouter } from './infrastructure/routes/suscripcionRoutes.js';

// --- CLASES: OPERACIONES ---
import { MongoOperacionRepository } from './infrastructure/database/MongoOperacionRepository.js';
import { OperacionService } from './application/services/OperacionService.js';
import { OperacionController } from './infrastructure/server/OperacionController.js';
import { crearOperacionRouter } from './infrastructure/routes/operacionRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 💉 INYECCIÓN DE DEPENDENCIAS (EL ARMADO)
// ==========================================

// 1. Repositorios (Capa de Datos)
const puestoRepo = new MySQLPuestoRepository();
const usuarioRepo = new MySQLUsuarioRepository();
const suscripcionRepo = new MySQLSuscripcionRepository(); // <--- Aquí estaba el riesgo
const operacionRepo = new MongoOperacionRepository();

// 2. Servicios (Capa de Lógica)
// Nota: SuscripcionService necesita usuarioRepo para validar usuarios
const puestoService = new PuestoService(puestoRepo);
const usuarioService = new UsuarioService(usuarioRepo);
const suscripcionService = new SuscripcionService(suscripcionRepo, usuarioRepo); 
const operacionService = new OperacionService(
    puestoRepo,       // <--- Antes tenías 'puestoRepository' (Error)
    operacionRepo,    // <--- Antes tenías 'mongoOperacionRepository' (Error)
    suscripcionService, // Este sí está bien
    usuarioRepo       // <--- Antes tenías 'usuarioRepository' (Error)
);

// 3. Controladores (Capa de Entrada)
const puestoController = new PuestoController(puestoService);
const usuarioController = new UsuarioController(usuarioService);
const suscripcionController = new SuscripcionController(suscripcionService);
const operacionController = new OperacionController(operacionService);

// ==========================================
// 🛣️ RUTAS
// ==========================================
app.use('/api/puestos', crearPuestoRouter(puestoController));
app.use('/api/usuarios', crearUsuarioRouter(usuarioController));
app.use('/api/suscripciones', crearSuscripcionRouter(suscripcionController));
app.use('/api/operaciones', crearOperacionRouter(operacionController));

// Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ==========================================
// 🚀 ARRANQUE
// ==========================================
const startServer = async () => {
    try {
        console.log('⏳ Conectando bases de datos...');
        await connectMySQL();
        await connectMongoDB();
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Servidor MercadoPop activo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error fatal:', error);
    }
};

startServer();
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURACIÓN DE BASE DE DATOS ---
import { connectMongoDB } from './infrastructure/config/mongo.js';
import { connectMySQL } from './infrastructure/config/sequelize.js'; // <--- OJO: Usamos la nueva de Sequelize

// --- IMPORTS DE PUESTOS ---
import { MySQLPuestoRepository } from './infrastructure/database/MySQLPuestoRepository.js';
import { PuestoService } from './application/services/PuestoService.js';
import { PuestoController } from './infrastructure/server/PuestoController.js';
import { crearPuestoRouter } from './infrastructure/routes/puestoRoutes.js';

// --- IMPORTS DE USUARIOS ---
import { MySQLUsuarioRepository } from './infrastructure/database/MySQLUsuarioRepository.js';
import { UsuarioService } from './application/services/UsuarioService.js';
import { UsuarioController } from './infrastructure/server/UsuarioController.js';
import { crearUsuarioRouter } from './infrastructure/routes/usuarioRoutes.js';

// --- IMPORTS DE OPERACIONES ---
import { MongoOperacionRepository } from './infrastructure/database/MongoOperacionRepository.js';
import { OperacionService } from './application/services/OperacionService.js';
import { OperacionController } from './infrastructure/server/OperacionController.js';
import { crearOperacionRouter } from './infrastructure/routes/operacionRoutes.js';

// --- IMPORTS DE SUSCRIPCIONES ---
import { MySQLSuscripcionRepository } from './infrastructure/database/MySQLSuscripcionRepository.js';
import { SuscripcionService } from './application/services/SuscripcionService.js';
import { SuscripcionController } from './infrastructure/server/SuscripcionController.js';
import { crearSuscripcionRouter } from './infrastructure/routes/suscripcionRoutes.js';

// --- DOCUMENTACIÓN SWAGGER (Opcional, si lo instalaste) ---
import swaggerUi from 'swagger-ui-express';
import { specs } from './infrastructure/config/swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- INYECCIÓN DE DEPENDENCIAS ---

// 1. Puestos
const puestoRepository = new MySQLPuestoRepository();
const puestoService = new PuestoService(puestoRepository);
const puestoController = new PuestoController(puestoService);

// 2. Usuarios (Ahora usa Sequelize por dentro)
const usuarioRepository = new MySQLUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

// 3. Suscripciones
const suscripcionRepository = new MySQLSuscripcionRepository();
const suscripcionService = new SuscripcionService(suscripcionRepository, usuarioRepository);
const suscripcionController = new SuscripcionController(suscripcionService);

// 4. Operaciones (Híbrido)
const mongoOperacionRepository = new MongoOperacionRepository();
// OperacionService necesita validar saldo (Suscripcion) y usuario (Usuario)
const operacionService = new OperacionService(
    puestoRepository, 
    mongoOperacionRepository, 
    suscripcionService 
); 
const operacionController = new OperacionController(operacionService);

// --- RUTAS ---
app.use('/api/puestos', crearPuestoRouter(puestoController));
app.use('/api/usuarios', crearUsuarioRouter(usuarioController));
app.use('/api/suscripciones', crearSuscripcionRouter(suscripcionController));
app.use('/api/operaciones', crearOperacionRouter(operacionController));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// --- ARRANQUE DEL SERVIDOR (Lógica de inicio) ---
const startServer = async () => {
    try {
        console.log('⏳ Iniciando conexiones...');

        // 1. Conectar MySQL (Sequelize)
        await connectMySQL();
        
        // 2. Conectar MongoDB
        await connectMongoDB();

        // 3. Levantar Servidor Web
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
            console.log('📡 APIs listas para usar');
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar el servidor:', error);
    }
};

// ¡Ejecutamos!
startServer();
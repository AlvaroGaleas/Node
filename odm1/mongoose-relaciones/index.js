const mongoose = require('mongoose');

// Importamos tus escenas
const runOneToOne = require('./scenes/relacion-1-1');
const runOneToMany = require('./scenes/relacion-1-m');
const runManyToMany = require('./scenes/relacion-n-m');
const runOperators = require('./scenes/operadores');

async function main() {
    try {
        // Conexión
        await mongoose.connect('mongodb://127.0.0.1:27017/actividad_mongoose');
        console.log('✅ Conexión exitosa a MongoDB');

        // Ejecutamos las actividades en orden
        await runOneToOne();
        await runOneToMany(); // Este es el que ya tenías casi listo
        await runManyToMany();
        await runOperators();

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Cerramos conexión al terminar todo
        console.log('\n✅ Todas las actividades finalizadas. Cerrando conexión...');
        mongoose.connection.close();
    }
}

main();
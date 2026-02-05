import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize.js'; // Importa la conexión

const UsuarioModel = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombre_completo' // Mapeamos camelCase a snake_case de la BD
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'TITULAR', 'ARRENDATARIO'),
        defaultValue: 'ARRENDATARIO'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'usuarios', // Nombre real de la tabla en MySQL
    timestamps: false      // Si no usas createdAt/updatedAt
});

export default UsuarioModel;
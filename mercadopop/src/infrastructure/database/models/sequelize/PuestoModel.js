import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize.js';

const PuestoModel = sequelize.define('Puesto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('LIBRE', 'OCUPADO', 'MANTENIMIENTO'),
        defaultValue: 'LIBRE'
    },
    // Definimos explícitamente la FK
    usuarioTitularId: {
        type: DataTypes.INTEGER,
        field: 'usuario_titular_id', // Nombre real en la BD
        allowNull: true
    }
}, {
    tableName: 'puestos',
    timestamps: false
});

export default PuestoModel;
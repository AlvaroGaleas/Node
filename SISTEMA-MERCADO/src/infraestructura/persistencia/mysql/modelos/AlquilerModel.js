const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AlquilerModel = sequelize.define('Alquiler', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    dia_mercado_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'dias_mercado',
            key: 'id',
        },
    },
    numero_puesto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    pagado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'alquileres',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false,
});

// Índice único para evitar duplicados de puestos en el mismo día
AlquilerModel.addIndex('unique_puesto_dia', {
    fields: ['dia_mercado_id', 'numero_puesto'],
    unique: true,
});

module.exports = AlquilerModel;
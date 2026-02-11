const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DiaMercadoModel = sequelize.define('DiaMercado', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    administrador_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'administradores',
            key: 'id',
        },
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'activo', 'cerrado'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
    total_recaudado: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
}, {
    tableName: 'dias_mercado',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false,
});

module.exports = DiaMercadoModel;
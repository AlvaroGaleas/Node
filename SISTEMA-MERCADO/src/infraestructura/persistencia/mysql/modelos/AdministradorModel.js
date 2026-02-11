const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const AdministradorModel = sequelize.define('Administrador', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    total_puestos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 1,
        },
    },
}, {
    tableName: 'administradores',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
});

// Hook para hashear password antes de crear
AdministradorModel.beforeCreate(async (administrador) => {
    if (administrador.password_hash) {
        administrador.password_hash = await bcrypt.hash(administrador.password_hash, 10);
    }
});

// Método de instancia para verificar password
AdministradorModel.prototype.validarPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
};

module.exports = AdministradorModel;
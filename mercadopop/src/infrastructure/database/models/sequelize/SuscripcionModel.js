import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize.js';

const SuscripcionModel = sequelize.define('Suscripcion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        field: 'usuario_id', // Mapeo a snake_case
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('DIARIO', 'PACK_4', 'MENSUAL'),
        allowNull: false
    },
    creditosTotales: {
        type: DataTypes.INTEGER,
        field: 'creditos_totales',
        defaultValue: 0
    },
    creditosUsados: {
        type: DataTypes.INTEGER,
        field: 'creditos_usados',
        defaultValue: 0
    },
    fechaInicio: {
        type: DataTypes.DATE,
        field: 'fecha_inicio',
        defaultValue: DataTypes.NOW
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'suscripciones',
    timestamps: false
});

export default SuscripcionModel;
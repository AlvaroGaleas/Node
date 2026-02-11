import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de la base
    process.env.DB_USER,     // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

export const connectMySQL = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); 
        console.log('Conexión a MySQL con Sequelize exitosa');
    } catch (error) {
        console.error('Error conectando a MySQL:', error);
    }
};
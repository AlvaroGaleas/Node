import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' Conectado exitosamente a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1); // Detener la app si falla la base operativa
    }
};
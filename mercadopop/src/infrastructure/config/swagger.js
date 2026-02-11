import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MercadoPop 🛒',
      version: '1.0.0',
      description: 'API Híbrida (MySQL + MongoDB) para la gestión de plazas de mercado.',
      contact: {
        name: 'Soporte Técnico',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  //Busca comentarios en todos los archivos de rutas
  apis: ['./src/infrastructure/routes/*.js'], 
};

export const specs = swaggerJsdoc(options);
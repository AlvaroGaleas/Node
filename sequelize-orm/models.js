const { Sequelize, DataTypes } = require('sequelize');

// Conexión a Base de Datos Sqlite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Se creará un archivo con la DB aquí
    logging: false // Para no llenar la consola de texto SQL
});

// --- DEFINICIÓN DE MODELOS ---

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER
});

const Profile = sequelize.define('Profile', {
    bio: DataTypes.STRING,
    website: DataTypes.STRING
});

const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    views: DataTypes.INTEGER
});

const Category = sequelize.define('Category', {
    name: DataTypes.STRING
});

// --- IMPLEMENTACIÓN DE RELACIONES ---

// 1. Relación Uno a Uno (1:1) -> hasOne
User.hasOne(Profile); 
Profile.belongsTo(User); // La llave foránea se pone en Profile

// 2. Relación Uno a Muchos (1:N) -> hasMany
User.hasMany(Post);
Post.belongsTo(User);

// 3. Relación Muchos a Muchos (N:M) -> belongsToMany
Post.belongsToMany(Category, { through: 'PostCategories' });
Category.belongsToMany(Post, { through: 'PostCategories' });

// Exportamos
module.exports = { sequelize, User, Profile, Post, Category };
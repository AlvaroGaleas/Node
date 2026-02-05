const { sequelize, User, Profile, Post, Category } = require('./models');
const { Op } = require('sequelize'); // Importamos los Operadores

async function main() {
    try {
        // Sincronizar DB (force: true borra y crea tablas de nuevo)
        await sequelize.sync({ force: true });
        console.log("✅ Base de datos sincronizada.");

        // --- CREACIÓN DE DATOS ---
        const user1 = await User.create({ name: "Carlos", email: "carlos@test.com", age: 30 });
        const user2 = await User.create({ name: "Ana", email: "ana@test.com", age: 25 });
        const user3 = await User.create({ name: "Luis", email: "luis@test.com", age: 18 });

        await user1.createProfile({ bio: "Dev Fullstack", website: "carlos.dev" });

        const post1 = await Post.create({ title: "Sequelize Tutorial", content: "Es genial...", views: 150, UserId: user1.id });
        const post2 = await Post.create({ title: "NodeJS Avanzado", content: "Lo mejor...", views: 500, UserId: user1.id });
        const post3 = await Post.create({ title: "SQL vs NoSQL", content: "Comparativa...", views: 10, UserId: user2.id });

        const catTech = await Category.create({ name: "Tecnología" });
        const catCode = await Category.create({ name: "Programación" });

        // Relación N:M (Agregar categorías a posts)
        await post1.addCategory([catTech, catCode]); 
        await post2.addCategory(catCode);

        console.log("\n--- OPERADORES ---");

        // 1. Op.eq (Igual)
        const eqEx = await User.findAll({ where: { name: { [Op.eq]: 'Ana' } } });
        console.log("Op.eq (Es Ana):", eqEx.map(u => u.name));

        // 2. Op.gt (Mayor que) y Op.lt (Menor que)
        const ageEx = await User.findAll({ where: { age: { [Op.gt]: 20 } } }); // Mayores de 20
        console.log("Op.gt (Mayores de 20):", ageEx.map(u => `${u.name} (${u.age})`));

        // 3. Op.between (Entre rangos)
        const betEx = await Post.findAll({ where: { views: { [Op.between]: [100, 600] } } });
        console.log("Op.between (Vistas entre 100 y 600):", betEx.map(p => p.title));

        // 4. Op.like (Búsqueda parcial, similar a regex)
        const likeEx = await Post.findAll({ where: { title: { [Op.like]: '%Node%' } } });
        console.log("Op.like (Título contiene 'Node'):", likeEx.map(p => p.title));

        // 5. Op.in (Dentro de una lista)
        const inEx = await User.findAll({ where: { name: { [Op.in]: ['Carlos', 'Luis'] } } });
        console.log("Op.in (Es Carlos o Luis):", inEx.length);


        console.log("\n--- CONSULTAS ORM ---");

        // 1. findByPk (Buscar por Primary Key / ID)
        const userById = await User.findByPk(1);
        console.log("findByPk (ID 1):", userById.name);

        // 2. findOne (Buscar el primero que cumpla)
        const onePost = await Post.findOne({ where: { views: 500 } });
        console.log("findOne (Vistas 500):", onePost.title);

        // 3. Consultar columnas específicas (attributes)
        const partialUser = await User.findAll({ 
            attributes: ['name', 'email'] // SELECT name, email FROM Users...
        });
        console.log("Columnas específicas:", partialUser[0].toJSON());

        // 4. Ordenar datos (order)
        const orderedPosts = await Post.findAll({
            order: [['views', 'DESC']] // Orden descendente
        });
        console.log("Ordenado por vistas (DESC):", orderedPosts.map(p => `${p.title}: ${p.views}`));

        // 5. Consultar tablas relacionadas (include -> JOIN)
        const userWithData = await User.findOne({
            where: { name: 'Carlos' },
            include: [ // Trae los datos de otras tablas
                { model: Profile },
                { model: Post }
            ]
        });
        console.log(`Relaciones: ${userWithData.name} tiene perfil "${userWithData.Profile.bio}" y ${userWithData.Posts.length} posts.`);

        // 6. Agrupamiento (group) y funciones de agregación
        // Contar cuántos posts tiene cada usuario
        const groupEx = await Post.findAll({
            attributes: [
                'UserId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_posts']
            ],
            group: ['UserId']
        });
        console.log("Agrupamiento (Posts por usuario):", groupEx.map(g => g.toJSON()));


    } catch (error) {
        console.error(error);
    }
}

main();
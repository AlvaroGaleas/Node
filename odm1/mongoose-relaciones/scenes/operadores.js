const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Usaremos un esquema de Producto para probar operadores numéricos
const ProductSchema = new Schema({ name: String, price: Number, tags: [String] }); //Relacion embebida tags:string
const Product = mongoose.models.Product || model('Product', ProductSchema);

async function runOperators() {
    console.log('\n--- Ejecutando Actividad 3: Operadores ---');

    // Limpiamos y creamos datos de prueba
    await Product.deleteMany({});
    await Product.create([
        { name: "Laptop", price: 1000, tags: ["tech", "office"] },
        { name: "Mouse", price: 20, tags: ["tech", "accessory"] },
        { name: "Monitor", price: 200, tags: ["tech"] },
        { name: "Silla", price: 150, tags: ["furniture", "office"] }
    ]);

    // 1. $gt (Mayor que)
    const expensive = await Product.find({ price: { $gt: 100 } });
    console.log("1. Productos > $100 ($gt):", expensive.map(p => p.name));

    // 2. $in (En lista)
    const techOrChair = await Product.find({ name: { $in: ["Laptop", "Silla"] } });
    console.log("2. Laptop o Silla ($in):", techOrChair.map(p => p.name));

    // 3. $regex (Búsqueda de texto)
    const mProducts = await Product.find({ name: { $regex: /^M/ } }); // Empieza con M
    console.log("3. Empiezan con 'M' ($regex):", mProducts.map(p => p.name));

    // 4. $inc (Actualizar incrementando)
    await Product.updateOne({ name: "Mouse" }, { $inc: { price: 5 } });
    console.log("4. Precio del Mouse incrementado en 5 ($inc).");
}

module.exports = runOperators;
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json()); // Lectura de json

// Validaciones
// Validación general para todos los casos
const validarResultados = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    next();
};



//Ejemplo 1
app.post('/registro', [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage('La contraseña debe tener 8 caracteres, 1 mayúscula y 1 número'),
    validarResultados //Validacion de erorres
], (req, res) => {
    res.json({ mensaje: "Usuario registrado con éxito" });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});

//Ejemplo 2
app.post('/producto', [
    body('nombre').notEmpty(),
    body('sku')
        .matches(/^[A-Z]{3}-\d{4}$/)
        .withMessage('El SKU debe tener el formato AAA-0000'),
    validarResultados
], (req, res) => {
    res.json({ mensaje: "Producto creado", sku: req.body.sku });
});

//Ejemplo 3
app.post('/perfil', [
    body('fecha_nacimiento')
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
        .withMessage('La fecha debe estar en formato AAAA-MM-DD'),
    validarResultados
], (req, res) => {
    res.json({ mensaje: "Fecha válida recibida" });
});

//Ejemplo 4
app.post('/preferencias', [
    body('color_tema')
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Debe ser un color Hexadecimal válido (ej: #FF5733)'),
    validarResultados
], (req, res) => {
    res.json({ mensaje: "Color actualizado" });
});

//Ejemplo 5

app.post('/vehiculo', [
    body('placa')
        .matches(/^[A-Z]{3}[ -]\d{3}$/)
        .withMessage('La placa debe ser 3 letras, un espacio/guion y 3 números'),
    validarResultados
], (req, res) => {
    res.json({ mensaje: "Vehículo registrado" });
});
//Bloque 1:
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Bloque 2:
connection();

//Bloque 3:
const app = express();
const port = 3977;

//Bloque 4:
app.use(cors());

//Bloque 5:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Bloque 6:
const projectRoutes = require("./routes/project");
app.use('/api/project', projectRoutes);

//Bloque 7:
app.listen(port, ()=>{
    console.log("Servidor esta corriendo correctamente en el puerto: "+port);
})
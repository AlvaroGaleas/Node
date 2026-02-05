const express = require("express");
const router = express.Router();

//Bloque 1:
const ProjectController = require("../controllers/project");

//Bloque 2:
router.post("/save",ProjectController.save);
router.get("/projects", ProjectController.projects);
router.put("/update", ProjectController.update);
router.delete("/delete/:id", ProjectController.deleteProject);
//Bloque 3:
module.exports = router;
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const StudentSchema = new Schema({ name: String, courses: [{ type: Schema.Types.ObjectId, ref: 'CourseNM' }] });
const CourseSchema = new Schema({ title: String, students: [{ type: Schema.Types.ObjectId, ref: 'StudentNM' }] });

// Usamos nombres distintos (StudentNM) para evitar choques si ya existen en otros archivos
const Student = mongoose.models.StudentNM || model('StudentNM', StudentSchema);
const Course = mongoose.models.CourseNM || model('CourseNM', CourseSchema);

async function runManyToMany() {
    console.log('\n--- Ejecutando Relación N:M (Estudiantes <-> Cursos) ---');

    const math = await Course.create({ title: "Matemáticas" });
    const history = await Course.create({ title: "Historia" });

    const student = await Student.create({ 
        name: "Ana", 
        courses: [math._id, history._id] // Ana toma ambos cursos
    });

    // Ana aparece en Matemáticas también (Relación bidireccional opcional)
    math.students.push(student._id);
    await math.save();

    const populatedStudent = await Student.findOne({ name: "Ana" }).populate('courses');
    console.log(`Estudiante: ${populatedStudent.name}`);
    console.log("Cursos inscritos:", populatedStudent.courses.map(c => c.title).join(', '));
}

module.exports = runManyToMany;
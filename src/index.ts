import express , {Request, Response}from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

// Carga las variables de entorno desde .env
dotenv.config();
const app = express();
// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json());
const port = 3000;

// Configura la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'), // Utiliza 5432 si no se especifica en .env
});

app.get('/', (req: Request, res: Response) => {
  // Ejemplo de consulta a la base de datos
  pool.query('SELECT course, lesson, "courseId" FROM public.courses', (error, result) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      res.json(result.rows);
    }
  });
});
// Ruta para crear un nuevo registro
app.post('/', async (req: Request, res: Response) => {
  try {
    const { course, lesson, courseId } = req.body;
    const query = 'INSERT INTO public.courses (course, lesson, "courseId") VALUES ($1, $2, $3) RETURNING *';
    const values = [course, lesson, courseId];
    
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear un registro:', error);
    res.status(500).json({ error: 'Error al crear un registro' });
  }
});

// Ruta para obtener un registro por su ID
app.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM public.courses WHERE "courseId" = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Registro no encontrado' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener el registro:', error);
    res.status(500).json({ error: 'Error al obtener el registro' });
  }
});
// Ruta para eliminar un registro por su ID
app.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM public.courses WHERE "courseId" = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      res.json({ message: 'Registro eliminado correctamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});
// Ruta para editar un registro por su ID
app.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { curse, lession, courseId } = req.body;
    const query = 'UPDATE public.courses SET curse = $1, lesson = $2, "courseID" = $3 WHERE "courseID" = $4 RETURNING *';
    const values = [curse, lession, courseId, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Registro no encontrado' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});
app.listen(port, () => {
  console.log(`Express Server listening on port:  ${port}`);
});
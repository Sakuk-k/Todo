import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv'

const environment = process.env.NODE_ENV

dotenv.config()

const { Pool } = pkg;  
const port = 3001;


const openDb = () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'Qwerty123',
    port: 5432,
  });
  return pool;
};






const app = express();
app.use(cors());
app.use(express.json());  


app.get('/', (req, res) => {
  const pool = openDb();

  pool.query('SELECT * FROM task', (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(result.rows);
  });
});

// POST route to create a new task
app.post('/create', (req, res) => {
  const pool = openDb();

  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [req.body.description],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ id: result.rows[0].id });
    }
  );
});

// DELETE route to delete a task by ID
app.delete('/delete/:id', (req, res) => {
  const pool = openDb();
  const id = parseInt(req.params.id);

  pool.query(
    'DELETE FROM task WHERE id = $1',
    [id],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ id: id });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

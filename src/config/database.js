import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'crossword_user',
  host: 'localhost',
  database: 'crossword_game',
  password: 'taglo',
  port: 5432,  // Default PostgreSQL port
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

export default pool;
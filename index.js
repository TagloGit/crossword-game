const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');  // This is the connection to your PostgreSQL database
const app = express();

app.use(express.json());  // This allows us to handle JSON in requests

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, passwordHash]
    );

    res.status(201).json(newUser.rows[0]);  // Return the new user without the password hash
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

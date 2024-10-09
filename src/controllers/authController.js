import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    // Return success message
    res.status(201).json({ message: 'User created successfully', user: { email: newUser.rows[0].email } });
  } catch (err) {
    console.error('Error during signup:', err.message);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET || 'your_jwt_secret',  // Use environment variable in production
      { expiresIn: '1h' }
    );

    // Return the token to the client
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, paternalLastName, maternalLastName, email, address, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Check if registering admin
    const role = email.toLowerCase() === 'jomosanano@gmail.com' ? 'admin' : 'customer';

    const newUser = await db.query(
      'INSERT INTO users ("firstName", "paternalLastName", "maternalLastName", email, address, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, "firstName", "paternalLastName", "maternalLastName", email, address, role',
      [firstName, paternalLastName, maternalLastName, email, address, hashedPassword, role]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      ...user,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      // Don't send back the hashed password
      delete user.password;
      res.json({
        ...user,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
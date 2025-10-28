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

// @route   POST /api/auth/forgot-password
// @desc    Request password reset link
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const userResult = await db.query('SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        const user = userResult.rows[0];

        if (user) {
            // In a real app, you would generate a secure token, store it in the password_reset_tokens table, and email it.
            // For this exercise, we will just log a predictable token.
            console.log(`Mock password reset link for ${email} would be: /#/reset-password/mock-reset-token-${user.id}`);
        } else {
             // To prevent user enumeration, don't reveal if an email exists or not.
             console.log(`Mock password reset requested for non-existent user ${email}, but we send a generic success message.`);
        }
        
        // Always return a success-like message.
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// @route   POST /api/auth/reset-password
// @desc    Reset password with a token
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { token, newPass } = req.body;
    try {
        // This logic mimics the mockApi.ts and is not secure for production.
        if (!token || !token.startsWith('mock-reset-token-')) {
            return res.status(400).json({ message: 'El enlace de restablecimiento no es válido o ha expirado.' });
        }

        const userId = token.replace('mock-reset-token-', '');
        const userResult = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        
        if (!user) {
             return res.status(400).json({ message: 'El enlace de restablecimiento no es válido o ha expirado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPass, salt);
        
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        
        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
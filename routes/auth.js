const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user, requiring email verification
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, paternalLastName, maternalLastName, email, address, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const role = email.toLowerCase() === 'jomosanano@gmail.com' ? 'admin' : 'customer';

    // Create user with isVerified = false
    const newUserResult = await pool.query(
      'INSERT INTO users ("firstName", "paternalLastName", "maternalLastName", email, address, password, role, "isVerified") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email',
      [firstName, paternalLastName, maternalLastName, email, address, hashedPassword, role, false]
    );
    
    const user = newUserResult.rows[0];

    // Simulate sending verification email
    const verificationToken = `mock-verify-token-${user.id}`;
    console.log(`--- SIMULACIÓN DE CORREO DE VERIFICACIÓN ---`);
    console.log(`Para: ${user.email}`);
    console.log(`Asunto: Verifica tu cuenta en MercaMorelos`);
    console.log(`Cuerpo: Para completar tu registro, usa el siguiente enlace:`);
    console.log(`http://localhost:5173/#/verify-email/${verificationToken}`);
    console.log(`------------------------------------------`);

    // Respond without a token, just a message
    res.status(201).json({
      message: '¡Registro exitoso! Por favor, revisa tu correo electrónico para activar tu cuenta.'
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
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Por favor, verifica tu correo electrónico para iniciar sesión.' });
      }

      // Don't send back the hashed password
      delete user.password;
      res.json({
        ...user,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


// @route   POST /api/auth/verify-email
// @desc    Verify user's email with a token
// @access  Public
router.post('/verify-email', async (req, res) => {
    const { token } = req.body;
    try {
        if (!token || !token.startsWith('mock-verify-token-')) {
            return res.status(400).json({ message: 'El enlace de verificación no es válido o ha expirado.' });
        }
        
        const userId = token.replace('mock-verify-token-', '');
        const result = await pool.query('UPDATE users SET "isVerified" = true WHERE id = $1 RETURNING id', [userId]);

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado. El enlace puede ser inválido.' });
        }

        res.status(200).json({ message: 'Email verified successfully.' });

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
        const userResult = await pool.query('SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        const user = userResult.rows[0];

        if (user) {
            // Simulate sending reset email
            const resetToken = `mock-reset-token-${user.id}`;
            console.log(`--- SIMULACIÓN DE CORREO DE RESTABLECIMIENTO ---`);
            console.log(`Para: ${user.email}`);
            console.log(`Asunto: Restablece tu contraseña de MercaMorelos`);
            console.log(`Cuerpo: Para restablecer tu contraseña, haz clic aquí: http://localhost:5173/#/reset-password/${resetToken}`);
            console.log(`-----------------------------------------------`);
        } else {
             console.log(`Mock: Password reset requested for non-existent user ${email}, but we send a generic success message.`);
        }
        
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
        if (!token || !token.startsWith('mock-reset-token-')) {
            return res.status(400).json({ message: 'El enlace de restablecimiento no es válido o ha expirado.' });
        }

        const userId = token.replace('mock-reset-token-', '');
        const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        
        if (!user) {
             return res.status(400).json({ message: 'El enlace de restablecimiento no es válido o ha expirado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPass, salt);
        
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        
        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

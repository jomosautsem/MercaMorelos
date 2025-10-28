const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user using Supabase Auth
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, paternalLastName, maternalLastName, email, address, password } = req.body;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        paternalLastName,
        maternalLastName,
        address,
        role: email.toLowerCase() === 'jomosanano@gmail.com' ? 'admin' : 'customer',
      }
    }
  });

  if (error) {
    console.error('Supabase registration error:', error.message);
    // Map Supabase error to a user-friendly message
    let userMessage = 'Ocurrió un error durante el registro.';
    if (error.message.includes('User already registered')) {
        userMessage = 'El correo electrónico ya está en uso.';
    } else if (error.message.includes('Password should be at least 6 characters')) {
        userMessage = 'La contraseña debe tener al menos 6 caracteres.';
    }
    return res.status(error.status || 400).json({ message: userMessage });
  }

  // Supabase handles the email sending. If successful, user object exists but session is null until verification.
  if (data.user) {
    res.status(201).json({
      message: '¡Registro exitoso! Por favor, revisa tu correo electrónico para activar tu cuenta.'
    });
  } else {
    res.status(500).json({ message: 'Error desconocido al crear el usuario.' });
  }
});


// @route   POST /api/auth/login
// @desc    Authenticate user & get session using Supabase
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase login error:', error.message);
    let userMessage = 'Credenciales inválidas.';
    if (error.message.includes('Email not confirmed')) {
      userMessage = 'Por favor, verifica tu correo electrónico para iniciar sesión.';
    }
    return res.status(error.status || 401).json({ message: userMessage });
  }

  res.json({
    user: data.user,
    session: data.session
  });
});


// @route   POST /api/auth/forgot-password
// @desc    Request password reset link via Supabase
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    // The redirect URL must be whitelisted in your Supabase project settings
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/#/update-password', // This URL is where Supabase will send the user
    });

    if (error) {
        console.error('Supabase forgot password error:', error.message);
        // Do not reveal if an email exists or not for security.
        // Log the error but send a generic success message.
    }
    
    // Always return a success-like message to prevent user enumeration attacks.
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
});


module.exports = router;
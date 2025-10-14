require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
// Increase payload size limit for base64 images
app.use(express.json({ limit: '10mb' }));


// Function to ensure admin user exists and has the correct hashed password
const ensureAdminUser = async () => {
    const adminEmail = 'jomosanano@gmail.com';
    const adminPassword = '1q2w3e12';

    const client = await db.getClient();
    try {
        const res = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
        const adminUser = res.rows[0];
        
        if (adminUser) {
            // Admin exists, check if password needs updating (e.g., it was stored as plaintext)
            const passwordMatch = await bcrypt.compare(adminPassword, adminUser.password);
            if (!passwordMatch) {
                console.log('Admin password mismatch. Updating password...');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(adminPassword, salt);
                await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, adminEmail]);
                console.log('Admin password updated successfully.');
            } else {
                console.log('Admin user is correctly configured.');
            }
        } else {
            // Admin does not exist, create it
            console.log('Admin user not found. Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);
            await client.query(
                'INSERT INTO users ("firstName", "paternalLastName", "maternalLastName", email, address, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                ['Admin', 'Merca', 'Morelos', adminEmail, 'Admin Address 123', hashedPassword, 'admin']
            );
            console.log('Admin user created successfully.');
        }
    } catch (error) {
        // Log error but don't crash server start
        console.error('Error during admin user setup:', error);
    } finally {
        client.release();
    }
};


// Test DB connection and ensure admin
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Database connected successfully at', res.rows[0].now);
    ensureAdminUser(); // Run the admin setup
  }
});


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => {
    res.send('MercaMorelos API is running...');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Wassup');
});

app.get('/db-test', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            success: true,
            message: "Database connection successful!", 
            data: result.rows
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);

        res.status(500).json({
            success: false, 
            message: "Internal Server Error", 
            detail: error.message
        });
    }
});

app.post('/auth/register', async (req, res) => {
    // Extracts the submitted fields from req.body
    const { user_first_name, user_last_name, user_email, password } = req.body;

    try {
        // Returns a 400 if any field is missing
        if (!user_first_name || !user_last_name || !user_email || !password) {
            return res.status(400).json({
                success: false, 
                message: "Please provide your first name, last name, email address and password."
            });
        }

        // Normalises email address
        const normalisedEmail = user_email.trim().toLowerCase();

        // Queries the database to check for an existing email
        const result = await pool.query('SELECT user_id FROM Users WHERE user_email = $1', [normalisedEmail]);

        // Returns a 409 if the email is already registered
        if (result.rows.length > 0) {
            return res.status(409).json({
                success: false, 
                message: "Sorry, but this email address is already in use."
            });
        }

        // Hashes the password using bcrypt
        const password_hash = await bcrypt.hash(password, 10);

        // Inserts a new users and retrieves the safe fields
        const newUser = await pool.query('INSERT INTO Users (user_first_name, user_last_name, user_email, password_hash) VALUES ($1, $2, $3, $4) RETURNING user_id, user_first_name, user_last_name, user_email, created_at', [user_first_name, user_last_name, normalisedEmail, password_hash]);

        // Returns a 201 with the new user's details
        res.status(201).json({
            success: true, 
            message: "User registration successful!", 
            data: newUser.rows[0]
        });

    } catch (error) {
        console.error("User registration failed:", error.message);

        res.status(500).json({
            success: false, 
            message: "Internal Server Error"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
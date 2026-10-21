const express = require('express');
const app = express();
const port = 3000;

const pool = require('./db');

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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
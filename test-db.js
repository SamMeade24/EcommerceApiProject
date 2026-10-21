const pool = require('./db');

pool.query('SELECT NOW()')
    .then(result => {
        console.log('Database connected successfully!');
        console.log('Server time:', result.rows[0].now);
    })
    .catch(error => {
        console.error('Database connection failed:', error.message);
    })
    .finally(() => {
        pool.end();
    }
);


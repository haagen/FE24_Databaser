require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Skapa en anslutningspool till databasen
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/users', async (req, res) => {

    try {
        const sql = 'SELECT * FROM users';  // Notera inget semikolon i slutet på frågan
        const [ rows ] = await pool.query(sql);
        res.json(rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }

});


app.post('/users', async (req, res) => {
    const { username, email } = req.body;

    if(!username || !email) {
        res.status(400).json({ message: 'Username and email are required' });
        return;
    }

    try {
        const sql = `INSERT INTO users (username, email) VALUES (?, ?)`;
        const [ result ] = await pool.query(
            sql,
            [ username, email ]
        );

        res.status(201).json({
            message: 'User created',
            userId: result.insertId
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }
});


app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+PORT);
});
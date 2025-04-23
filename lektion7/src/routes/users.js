import pool from '../helpers/database.js';
import { Router } from 'express';

const router = Router(); 

router.get('/', async(req, res) => {
    try {
        const sql = 'SELECT * FROM users';
        const [ rows ] = await pool.query(sql);
        res.json(rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }
});

router.post('/', async (req, res) => {

    const { username, email } = req.body;

    if(!username || !email) {
        return res.status(400).json({ message: 'Username and email are required!' });
    }

    try {
        const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
        const [ result ] = await pool.query(
            sql, 
            [ username, email ]
        );

        res.status(201).json({
            message: 'User created',
            userId: result.insertId
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Database error' });
    }

});

export default router;
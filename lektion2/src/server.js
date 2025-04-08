// Load required libraries and modules
require('dotenv').config();
const express = require('express');
const users = require('./users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware');


const PORT = process.env.PORT || 3000;

const app = express();

// A simple logging middleware
const logger = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};

// The order of middlewares is important!
app.use(logger);
app.use(express.static('public'));
app.use(express.json());


app.post('/login', (req, res) => {
    // Read username and password from body
    const { username, password } = req.body;
    // Find the user in the "in memory database"
    const user = users.find(
        u => u.username === username
    );
    // Send and error if the user wasn't found
    if(!user) return res.status(400).json({
        message: 'Invalid credentials'
    });
    // Validate password
    const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
    );
    if(!passwordIsValid) return res.status(400).json({
        message: 'Invalid credentials'
    });

    // Create JWT-token
    const token = jwt.sign(
        // Payload
        {
            userId: user.id,
            username: user.username
        },
        // Secret
        process.env.JWT_SECRET,
        // Option
        {
            expiresIn: '1h'
        }
    );
    // Send the token to the client
    res.json({
        token
    });
});

// A small endpoint to validate tokens
app.get('/validate-token/:token', (req, res) => {
    const token = req.params.token;

    jwt.verify(
        // Token
        token,
        // Secret from environment variables (.env file)
        process.env.JWT_SECRET,
        // Callback to handle verification
        (err, payload) => {
            if(err) return res.status(403).json({
                message: 'Invalid token'
            });
            res.json({
                message: 'Token is valid',
                payload
            });
        } 
    );

});

// This endpoint is protected, it must have an 
// Authroization: Bearer xxx.yyy.zzz
// header set, where xxx,yyy.zzz should be a valid token
app.get('/fortnox', authenticateToken, (req, res) => {
    // Here we have access to req.user since that is set in the 
    // authenticateToken middleware
    res.json({
        message: 'Show me the money ' + req.user.username + '!'
    });
});

// Start up the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
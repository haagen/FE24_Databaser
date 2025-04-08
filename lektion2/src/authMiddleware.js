const jwt = require('jsonwebtoken');
const users = require('./users');

function authenticateToken(req, res, next) {

    // Fetch Authorization header
    const authHeader = req.headers['authorization'];
    // Fetch token from header
    const token = authHeader && authHeader.split(' ')[1];
    
    // Give an error if the token is missing
    if(!token) return res.status(401).json({
        message: 'Token is messing'
    });

    jwt.verify(
        // Token
        token, 
        // Secret
        process.env.JWT_SECRET,
        // Callback function
        (err, payload) => {
            if(err) return res.status(403).json({
                message: 'Invalid token'
            });
            
            // Load user info from "in memory database"
            const user = users.find( u => u.id == payload.userId);
            req.user = user;

            // Call the next middleware in the chain
            next();
        }
    );
}

module.exports = authenticateToken;
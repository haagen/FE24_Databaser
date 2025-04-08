const bcrypt = require('bcryptjs');

const users = [

    {
        id: 666, 
        username: 'alice',
        password: bcrypt.hashSync('password123', 8)  // hashed password
    },
    {
        id: 1337, 
        username: 'bob',
        password: bcrypt.hashSync('password456', 8)  // hashed password
    }

];

module.exports = users;
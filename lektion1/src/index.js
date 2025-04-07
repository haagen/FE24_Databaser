
const express = require('express');
const app = express();

app.use(express.json());                // Middleware to automatically parse JSON

let todos = [                           // Initialize our "in memory database"
    { id: 1, task: "Learn Node.js", completed: false },
    { id: 2, task: "Learn Express", completed: false },
    { id: 3, task: "Build a REST API", completed: false}
];

app.get('/todos', (req, res) => {
    res.json(todos);                    // Send the list of todos to the client as JSON
});

app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id); // Parse and Store the URL-parameter
    const todo = todos.find((rad) => {      // Find the correct row in the in memory database
        return rad.id === todoId;
    });

    if(todo){                               // If we found it, return the row
        res.json(todo);
    } else {
        res.status(404).json({              // If not, return an error message to the client
            message: "Todo not found"
        });
    }

});

app.post('/todos', (req, res) => {          

    // Find the biggest ID and add one to it, use it as the next available id
    const nextId = todos.reduce((maxId, rad) => {
        return Math.max(maxId, rad.id);
    }, 0) + 1;

    // Create a new object
    const newTodo = {
        id: nextId,
        task: req.body.task,
        completed: req.body.completed
    };

    // Store the object to our "in memory database"
    todos.push(newTodo);
    res.status(200).json(newTodo);      // Return the newly created todo to the client 

});

app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    todos = todos.filter((rad) => {     // Filter the result -- e.g. keep all rows that doesn't match the id
        return rad.id !== todoId
    });
    res.status(204).send();             // Return a status to the client
});


app.listen(3000, () => {                // Start the server on port 3000
    console.log(`Server is running on http://localhost:3000`);
});

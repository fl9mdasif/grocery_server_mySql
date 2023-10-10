// Import required packages
const mysql = require('mysql2'); // Use 'mysql2' instead of 'mysql'
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();


// Enable CORS for all routes
app.use(cors());
app.use(express.json());


// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // Replace with your MySQL host
    user: process.env.DB_USER,       // Replace with your MySQL user
    password: process.env.DB_PASS,  // Replace with your MySQL password
    database: process.env.DB_DATABASE       // Replace with your database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});



const getProduct = (callback) => {
    connection.query('SELECT * FROM products', callback);
};

app.get('/products', (req, res) => {

    getProduct((err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});


// Create operation
const postProduct = (user, callback) => {
    connection.query('INSERT INTO products SET ?', user, callback);
};


// Create a new user
app.post('/postProduct', (req, res) => {
    const newProducts = req.body; // Assuming you send the new user data in the request body

    postProduct(newProducts, (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Product created successfully', newProducts });
        }
    });
});





const updateProduct = (id, product, callback) => {
    connection.query('UPDATE products SET ? WHERE id = ?', [product, id], callback);
};
// Update a user by ID
app.put('/product/:id', (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body; // Assuming you send the updated user data in the request body

    updateProduct(productId, updatedData, (err, result) => {
        if (err) {
            console.error('Error updating pro:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Product updated successfully', result });
        }
    });
});


// Delete operation
const deleteProduct = (id, callback) => {
    connection.query('DELETE FROM products WHERE id = ?', id, callback);
};
// Delete a user by ID
app.delete('/product/:id', (req, res) => {
    const productId = req.params.id;

    deleteProduct(productId, (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ message: 'Product deleted successfully', result });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
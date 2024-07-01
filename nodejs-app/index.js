const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'mysql-container',
    user: 'myuser',
    password: 'mypassword',
    database: 'mydatabase'
});
  
// No need to manually connect when using pool

// Define a route to get a random row
app.get('/random', (req, res) => {
  const query = 'SELECT * FROM mytable ORDER BY RAND() LIMIT 1';
  
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection from pool:', err);
      res.status(500).send('Server Error');
      return;
    }
    
    // Execute query
    connection.query(query, (err, results) => {
      // Release connection back to pool
      connection.release();
      
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }
      res.json(results[0]);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

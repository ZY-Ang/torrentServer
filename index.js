/**
 * Main backend API and entry point for express.
 */
const express = require('express');

/**
 * 1. Construct an express application.
 */
const app = express();

/**
 * 2. Use the static folder to serve files
 */
app.use('/', express.static('public'));

var port = 80;

/**
 * 3. Let the server begin listening to requests
 *      on the configured port.
 */
app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port: ', port.toString());
});

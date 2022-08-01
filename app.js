// Lucas Bubner, 2022

// Initialise application using Express framework
const express = require('express');
const app = express();
// Set public folder for static requests such as our CSS and our images
app.use(express.static('public'));

// Default request
app.get('/', (req, res) => {
  res.sendFile('./html/index.html', { root: __dirname });
});

// Start server on port 8888
app.listen(8888, () => {
  console.log('Server started!');
});

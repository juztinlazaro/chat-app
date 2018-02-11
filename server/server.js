require('../.config/config.js');
// imports
const path = require('path');
const express = require('express');

// declaration
const publicPath = path.join(__dirname, '/../public');
let app = express();

app.use(express.static(publicPath));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is now up on port ${port}`);
});

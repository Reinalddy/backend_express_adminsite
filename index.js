// import express
const express = require('express');

// init app
const app = express();

// init cors
const cors = require('cors');

// import body parser
const bodyParser = require('body-parser');
// import routes
const router = require('./routes');

// definde port
const port = 3000;

// use cors
app.use(cors());

// use body parser
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// define routes
app.use('/api', router);

// start server
app.listen(port, () => {
  console.log('server running on port ' + port);
})

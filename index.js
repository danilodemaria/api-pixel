require('dotenv').config();
const Firebird = require('node-firebird');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const options = {
  host: 'localhost',
  port: 3050,
  database: 'C:/Users/Danilo/Desktop/PIXEL.FDB',
  user: 'SYSDBA',
  password: '15bfc49318',
  lowercase_keys: false, // set to true to lowercase keys
  role: null, // default
  pageSize: 4096, // default when creating database
  pageSize: 4096, // default when creating database
  retryConnectionInterval: 1000, // reconnect interval in case of connection drop
};

Firebird.attach(options, function (err, db) {
  if (err) throw err;

  // db = DATABASE
  db.query('SELECT * FROM ACESSO_API', function (err, result) {
    // IMPORTANT: close the connection
    console.log(result);
    db.detach();
  });
});

app.use(express.json());
app.use(cors({}));
app.use('/api', require('./routes/index'));

app.listen(port, '0.0.0.0', () => {
  console.log(`running on port ${port}`);
});

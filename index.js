require('dotenv').config();
const Firebird = require('node-firebird');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const options = {
  host: 'localhost',
  port: 3050,
  database: 'C:\\data\\PIXEL.FDB',
  user: 'sysdba',
  password: '15bfc49318',
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

Firebird.attach(options, function (err, db) {
  if (err) {
    console.log(err);
    throw err;
  }

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

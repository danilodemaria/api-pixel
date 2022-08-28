const express = require('express');
const router = express.Router();
const Firebird = require('node-firebird');
const { getOS } = require('../querys/getOs');

router.get('/', async (req, res) => {
  const options = {
    host: process.env.DATABASE_URL,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_PATH,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    lowercase_keys: process.env.DATABASE_LOWER_CASE,
    role: process.env.DATABASE_ROLE,
    pageSize: process.env.DATABASE_PAGE_SIZE,
  };
  Firebird.attach(options, function (err, db) {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: 'Erro na consulta', err });
    }

    db.query('SELECT * FROM ACESSO_API', function (err, result) {
      // IMPORTANT: close the connection
      db.detach();
      return res.status(200).send(result);
    });
  });
});

module.exports = router;

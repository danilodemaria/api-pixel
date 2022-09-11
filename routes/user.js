const express = require('express');
const router = express.Router();
const Firebird = require('node-firebird');
const { validateAndFormatDocument } = require('../utils/validations');
const ApiError = require('../error/ApiError');

router.get('/:document', async (req, res) => {
  const {
    params: { document },
  } = req;

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
  try {
    const { document_type, rawDocument } = validateAndFormatDocument(document);
    const columnDatabase = document_type === 'CPF' ? 'CPF' : 'CNPJ';
    const query = `SELECT IDCLIFOREMP,TIPOCLIFOREMP, FANTASIA, RAZAO, IDCODIGOAGRUPA FROM CLIFOREMP WHERE ${columnDatabase}='${rawDocument}' `;
    console.log(query);
    Firebird.attach(options, function (err, db) {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Erro na consulta', err });
      }

      db.query(query, function (err, result) {
        // IMPORTANT: close the connection
        const ids = result.map(({ idcliforemp, idcodigoagrupa }) => ({
          idcliforemp,
          idcodigoagrupa,
        }));
        db.detach();
        return res.status(200).send({ ids, result });
      });
    });
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.code).send(error);
    return next(
      ApiError.internalservererror(
        `Internal Server Error, ${Object.keys(
          req.route.methods
        )[0].toUpperCase()}: ${req.originalUrl}`
      )
    );
  }
});

module.exports = router;

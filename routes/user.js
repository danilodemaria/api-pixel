const express = require('express');
const router = express.Router();
const Firebird = require('node-firebird');
const { validateAndFormatDocument } = require('../utils/validations');
const ApiError = require('../error/ApiError');
const databaseConfig = require('../config/database');

router.get('/:document', async (req, res, next) => {
  const {
    params: { document },
  } = req;

  try {
    const { document_type, rawDocument } = validateAndFormatDocument(document);
    const columnDatabase = document_type === 'CPF' ? 'CPF' : 'CNPJ';
    const query = `SELECT IDCLIFOREMP,TIPOCLIFOREMP, FANTASIA, RAZAO, IDCODIGOAGRUPA FROM CLIFOREMP WHERE ${columnDatabase}='${rawDocument}' `;
    Firebird.attach(databaseConfig, function (err, db) {
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

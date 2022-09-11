const ApiError = require('../error/ApiError');
const express = require('express');
const router = express.Router();
const { validateAndFormatDocument } = require('../utils/validations');
const { executeQuery } = require('../database/executeQuery');

router.get('/:document', async (req, res, next) => {
  const {
    params: { document },
  } = req;

  try {
    const { document_type, rawDocument } = validateAndFormatDocument(document);
    const columnDatabase = document_type === 'CPF' ? 'CPF' : 'CNPJ';
    const query = `SELECT IDCLIFOREMP,TIPOCLIFOREMP, FANTASIA, RAZAO, IDCODIGOAGRUPA FROM CLIFOREMP WHERE ${columnDatabase}='${rawDocument}' `;
    const databaseResponse = await executeQuery(query);
    return res.status(200).send(databaseResponse);
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

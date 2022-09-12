const express = require('express');
const ApiError = require('../error/ApiError');
const router = express.Router();
const { validateAndFormatDocument } = require('../utils/validations');
const { executeQuery } = require('../database/executeQuery');
const { getOS } = require('../querys/getOs');
router.get('/:document', async (req, res, next) => {
  const {
    params: { document },
  } = req;

  try {
    const { document_type, rawDocument } = validateAndFormatDocument(document);

    const columnDatabase = document_type === 'CPF' ? 'CPF' : 'CNPJ';
    const query = `SELECT IDCLIFOREMP,TIPOCLIFOREMP, FANTASIA, RAZAO, IDCODIGOAGRUPA FROM CLIFOREMP WHERE ${columnDatabase}='${rawDocument}' `;
    const databaseResponse = await executeQuery(query);
    const ids = databaseResponse.map(({ idcliforemp, idcodigoagrupa }) => ({
      idcliforemp,
      idcodigoagrupa,
    }));
    const queryBuilder = getOS(ids[0].idcliforemp, ids[0].idcodigoagrupa);
    const openedOS = await executeQuery(queryBuilder);
    return res.status(200).send(openedOS);
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.code).send(error);
    return next(
      ApiError.internalservererror(
        `Internal Server Error, ${Object.keys(
          req.route.methods,
        )[0].toUpperCase()}: ${req.originalUrl}`,
      ),
    );
  }
});

module.exports = router;

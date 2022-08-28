const express = require('express');
const router = express.Router();
const Firebird = require('node-firebird');
const { getOS } = require('../querys/getOs');
const { cpf, cnpj } = require('cpf-cnpj-validator');

const validateAndFormatDocument = (document) => {
  const rawDocument = document.replace(/[^\d]/g, '');
  const type = rawDocument.length === 11 ? 'CPF' : 'CNPJ';
  const valid =
    type === 'CPF' ? cpf.isValid(rawDocument) : cnpj.isValid(rawDocument);
  if (!valid) throw ApiError.badRequest('Documento inválido');
  return {
    document_type: type,
    rawDocument,
  };
};

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
  const { document_type, rawDocument } = validateAndFormatDocument(document);
  const columnDatabase = document_type === 'CPF' ? CPF : 'CNPJ';
  const query = `SELECT IDCLIFOREMP,TIPOCLIFOREMP, FANTASIA, RAZAO, IDCODIGOAGRUPA FROM CLIFOREMP WHERE ${columnDatabase}='${rawDocument}' `;

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
});

module.exports = router;

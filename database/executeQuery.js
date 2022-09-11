const ApiError = require('../error/ApiError');
const Firebird = require('node-firebird');
const databaseConfig = require('../config/database');

const attach = (config) => {
  return new Promise((resolve, reject) => {
    Firebird.attach(config, (err, db) => {
      if (err) {
        reject(err);
        throw ApiError.badRequest({
          message: 'Erro ao conectar banco de dados',
          err,
        });
      } else resolve(db);
    });
  });
};

const query = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(err);
        throw ApiError.badRequest({ message: 'Erro na consulta', err });
      } else resolve(result);
    });
  });
};

const executeQuery = async (sql) => {
  const db = await attach(databaseConfig);
  const result = await query(db, sql);
  const ids = result.map(({ idcliforemp, idcodigoagrupa }) => ({
    idcliforemp,
    idcodigoagrupa,
  }));
  db.detach();
  return { ids, result };
};

module.exports = {
  executeQuery,
};

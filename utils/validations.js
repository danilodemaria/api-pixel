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

module.exports = {
  validateAndFormatDocument,
};

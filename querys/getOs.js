const getOS = (id, id_agrupa) => {
  return `
  SELECT
CASE
		OS.ATENDIMENTO 
		WHEN 1 THEN
		'At. interno' 
		WHEN 2 THEN
		'At. externo' 
	END AS Desc_Atendimento,
	CAST(
	'N' AS CHAR ( 1 )) AS SELECAO,
	OS.*,
	OS_TRANSACAO.cor AS Cor_Transacao,
	CLIFOREMP.FANTASIA,
	CLIFOREMP.RAZAO,
	CLIFOREMP.UF,
	CLIFOREMP.FONE,
	OS_TRANSACAO.DESCRICAO AS TRANSACAO,
	OS_FASE.DESCRICAO AS FASE,
	CIDADE.DESCRICAO AS DESCRICAOCIDADE,
	OS_TRANSACAO.GARANTIA,
	CAST(
		COALESCE (( SELECT SUM( OS_SERVICO.QT * OS_SERVICO.CUSTO ) FROM OS_SERVICO WHERE OS_SERVICO.IDOS = OS.IDOS ), 0 ) AS DOUBLE PRECISION 
	) AS TOTAL_CUSTO_SERVICO,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QT * EF.VALORCUSTOMEDIOUNITARIO ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS TOTAL_CUSTOMEDIO,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QTSALDO * EF.VALORCUSTOMEDIOUNITARIO ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS SALDO_CUSTOMEDIO,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QT * EF.VALORCUSTOCONTABIL ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS TOTAL_CUSTOCONTABIL,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QTSALDO * EF.VALORCUSTOCONTABIL ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS SALDO_CUSTOCONTABIL,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QT * EF.CUSTOGERENCIAL ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS TOTAL_CUSTOGERENCIAL,
	CAST(
		COALESCE ((
			SELECT
				SUM( OS_PECA.QTSALDO * EF.CUSTOGERENCIAL ) 
			FROM
				OS_PECA,
				ESTOQUE_FILIAL EF 
			WHERE
				( EF.IDEMPRESA = OS.IDEMPRESA AND EF.IDFILIAL = OS.IDFILIAL AND EF.IDITEM = OS_PECA.IDITEM ) 
				AND ( OS_PECA.IDOS = OS.IDOS )),
			0 
		) AS DOUBLE PRECISION 
	) AS SALDO_CUSTOGERENCIAL,
	CAST(
		COALESCE (( SELECT SUM( OS_PECA.QT * OS_PECA.CUSTO ) FROM OS_PECA WHERE OS_PECA.IDOS = OS.IDOS ), 0 ) + COALESCE (( SELECT SUM( OS_SERVICO.QT * OS_SERVICO.CUSTO ) FROM OS_SERVICO WHERE OS_SERVICO.IDOS = OS.IDOS ), 0 ) AS DOUBLE PRECISION 
	) AS TOTAL_CUSTO 
FROM
	OS
	JOIN CLIFOREMP ON ( CLIFOREMP.IDCLIFOREMP = OS.IDCLIFOREMP )
	JOIN OS_TRANSACAO ON ( OS_TRANSACAO.IDTRANSACAO = OS.IDTRANSACAO )
	JOIN OS_FASE ON ( OS_FASE.IDFASE = OS.IDFASE )
	JOIN CIDADE ON ( CIDADE.IDCIDADE = CLIFOREMP.IDCIDADE ) 
WHERE
	OS.IDFILIAL IN ( 1 ) 
	AND OS.STATUS IN ( 0, 1, 2, 3, 4, 5, 6, 7 ) 
	AND ( OS.idcliforemp = ${id} OR cliforemp.idcodigoagrupa = ${id_agrupa} ) 
	AND OS.IDFASE = 2 
	AND OS.FATURADO = 'N'
`;
};

module.exports = {
  getOS,
};

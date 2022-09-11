const { createLogger, format, transports } = require('winston');

const timezoned = () =>
  new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

module.exports = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.simple(),
    format.timestamp({ format: timezoned }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      level: 'error',
      name: 'error-file',
      maxsize: 5120000,
      maxFiles: 10,
      filename: `${__dirname}/../logs/api-error.log`,
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 10,
      filename: `${__dirname}/../logs/log-api.log`,
    }),
    new transports.Console({
      level: 'debug',
      prettyPrint: false,
      colorize: false,
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.simple(),
        format.printf(({ timestamp, level, message, stack }) => {
          if (stack) {
            return `${timestamp} ${level}: ${message} - ${stack}`;
          }
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
});

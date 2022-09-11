require('custom-env').env();

module.exports = {
  host: process.env.DATABASE_URL,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_PATH,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  lowercase_keys: process.env.DATABASE_LOWER_CASE,
  role: process.env.DATABASE_ROLE,
  pageSize: process.env.DATABASE_PAGE_SIZE,
};

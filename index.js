require('custom-env').env();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT_SERVER;
const apiErrorHandler = require('./error/api-error-handler');

app.use(express.json());
app.use(cors({}));
app.use('/api', require('./routes/index'));
app.use(apiErrorHandler);
app.listen(port, '0.0.0.0', () => {
  console.log(`Running on port ${port}`);
});

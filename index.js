const express = require('express');
const expressWs = require('express-ws')(express());
require('dotenv').config();

const app = expressWs.app;
const port = 3000;

const logger = require('./src/db/psql_connector');
const mongo = require('./src/db/mongo_connector');

app.use('/log', require('./src/routes/log'));
app.use('/api', require('./src/routes/api'));
app.use('/ws', require('./src/routes/ws').router);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

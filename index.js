const express = require('express');
require('dotenv').config();

const app = express();
const port = 3000;

const logger = require('./src/db/psql_connector');
const mongo = require('./src/db/mongo_connector');

const { nanoid } = require('nanoid');

app.use('/log', require('./src/routes/log'));
app.use('/api', require('./src/routes/api'));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const express = require('express');
const app = express();
const port = 3000;

const logger = require('./src/db/psql_connector');
const mongo = require('./src/db/mongo_connector');

app.use('/log', express.text({ type: '*/*' }));

app.all('/log', async (req, res, next) => {
  // logger.createRequest(1, req.method, req.url, 'Blah');
  // console.log(logger.getRequest(0));
  id = await mongo.createRequest(req.headers, req.body);
  console.log(id);
  res.status(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

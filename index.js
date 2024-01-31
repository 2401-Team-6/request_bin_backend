const express = require('express');
require ("dotenv").config();

const app = express();
const port = 3000;

const logger = require('./src/db/psql_connector');
const mongo = require('./src/db/mongo_connector');

const { nanoid } = require('nanoid');

app.use('/log', express.text({ type: '*/*' }));

// logs all types of requests to endpoint
// path still includes /log, fixed on frontend?
app.all('/log/:name', async (req, res, next) => {
  const { name } = req.params;
  const loggerId = await logger.getEndpointId(name);
  if (loggerId === undefined) {
    return res.status(404).send("Object not found");
  }

  const requestId = await mongo.createRequest(req.headers, req.body);
  await logger.createRequest(requestId, req.method, req.path, loggerId);
  res.status(200).json();
});

// don't remember if we were going to implement tag functionality
// logs all types of requests to endpoint with a tag (ex. curl)
app.all('/log/:name/:tag', async (req, res, next) => {

});

// creates new endpoint
app.post('/api/new', async (req, res, next) => {
  const endpoint = nanoid();
  await logger.createEndpoint(endpoint);
  console.log(`${endpoint} created`);
  res.json({ endpoint });
});

// selects different endpoint
app.get('/api/:name', async (req, res, next) => {
  const { name } = req.params;
  const loggerId = await logger.getEndpointId(name);
  if (loggerId === undefined) {
    return res.status(404).send("Object not found");
  }

  const requests = await logger.getRequests(loggerId);
  console.log(requests);
  res.status(200).json(requests);
});

// selects individual request
app.get('/api/:name/:id', async (req, res, next) => {
  const { name, id } = req.params;
  const request = await mongo.getRequest(id);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

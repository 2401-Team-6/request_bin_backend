const express = require('express');
require ("dotenv").config();

const app = express();
const port = 3000;

const logger = require('./src/db/psql_connector');
const mongo = require('./src/db/mongo_connector');

const { nanoid } = require('nanoid');

app.use('/log', express.text({ type: '*/*' }));


// logs all types of requests to endpoint
app.all(['/log/:name', '/log/:name/*'], async (req, res, next) => {
  const { name } = req.params;
  const loggerId = await logger.getEndpointId(name);
  if (loggerId === undefined) {
    return res.status(404).send("Object not found");
  }

  let path = '/' + (req.params[0] ?? '');
  const requestId = await mongo.createRequest(req.headers, req.body, loggerId);
  await logger.createRequest(requestId, req.method, path, loggerId);
  console.log(requestId);
  console.log(path);
  res.status(200).json();
});

// creates new endpoint
app.post('/api/new', async (req, res, next) => {
  const hash = nanoid();
  const { id, created } = await logger.createEndpoint(hash);
  console.log(`${hash} created`);
  res.json({ id, created, hash });
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

// delete all requests
app.delete('/api/:name', async (req, res, next) => {
  const { name } = req.params;
  const loggerId = await logger.getEndpointId(name);
  if (loggerId === undefined) {
    return res.status(404).send("Object not found");
  }

  await logger.deleteAll(loggerId);
  mongo.deleteAll(loggerId);
  res.status(204).send();
});

// selects individual request
app.get('/api/:name/:id', async (req, res, next) => {
  const { id } = req.params;
  const request = await mongo.getRequest(id);
  res.status(200).json(request);
});

// deletes individual request
app.delete('/api/:name/:id', (req, res, next) => {
  const { id } = req.params;
  logger.deleteRequest(id);
  mongo.deleteRequest(id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

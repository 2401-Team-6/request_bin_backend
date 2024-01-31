const router = require('express').Router();

const logger = require('../db/psql_connector');
const mongo = require('../db/mongo_connector');

const { nanoid } = require('nanoid');

// creates new endpoint
router.post('/new', async (req, res, next) => {
  const hash = nanoid();
  try {
    const { id, created } = await logger.createEndpoint(hash);
    console.log(`Endpoint ${hash} created at ${created}`);
    res.status(201).json({ id, created, hash });
  } catch (err) {
    console.error('Could not connect to Postgres?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

// selects different endpoint
router.get('/:name', async (req, res, next) => {
  const { name } = req.params;
  try {
    const loggerId = await logger.getEndpointId(name);
    if (loggerId === undefined) {
      return res.status(404).json({ error: 'Object not found' });
    }

    const requests = await logger.getRequests(loggerId);
    console.log(
      `Endpoint ${name} retrieved: ${requests.length} records found.`
    );
    res.status(200).json(requests);
  } catch (err) {
    console.error('Could not connect to Postgres?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

// delete all requests
router.delete('/:name', async (req, res, next) => {
  const { name } = req.params;
  try {
    const loggerId = await logger.getEndpointId(name);
    if (loggerId === undefined) {
      return res.status(404).json({ error: 'Object not found' });
    }

    await logger.deleteAll(loggerId);
    await mongo.deleteAll(loggerId);

    console.log(`Endpoint ${name} cleared.`);
    res.status(204).send();
  } catch (err) {
    console.error('Could not connect to a Database?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

// selects individual request
router.get('/:name/:id', async (req, res, next) => {
  const { name, id } = req.params;
  try {
    const request = await mongo.getRequest(id);

    if (!request) {
      console.log(`Endpoint ${name} requested MONGO(${id}) does not exist.`);
      return res.status(404).json({ error: 'Object not found' });
    }

    console.log(`Endpoint ${name} retrieved ${id}`);
    res.status(200).json(request);
  } catch (err) {
    console.error('Could not connect to Mongo?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

// deletes individual request
router.delete('/:name/:id', async (req, res, next) => {
  const { name, id } = req.params;
  try {
    await logger.deleteRequest(id);
    await mongo.deleteRequest(id);

    console.log(`Endpoint ${name} deleted MONGO(${id})`);
    res.status(204).send();
  } catch (err) {
    console.error('Could not connect to a Database?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

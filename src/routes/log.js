const express = require('express');
const router = express.Router();

const logger = require('../db/psql_connector');
const mongo = require('../db/mongo_connector');

router.use(express.text({ type: '*/*' }));

// logs all types of requests to endpoint
router.all(['/:name', '/:name/*'], async (req, res, next) => {
  const { name } = req.params;
  try {
    const loggerId = await logger.getEndpointId(name);
    if (loggerId === undefined) {
      return res.status(404).json({ error: 'Object not found' });
    }

    let path = '/' + (req.params[0] ?? '');
    const requestId = await mongo.createRequest(
      req.headers,
      req.body,
      loggerId
    );
    await logger.createRequest(requestId, req.method, path, loggerId);

    console.log(
      `New Request for ${name}:`,
      `${req.method} ${path} - MONGO(${requestId})`
    );

    res.status(200).json();
  } catch (err) {
    console.error('Could not connect to a Database?', err);
    res.status(400).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

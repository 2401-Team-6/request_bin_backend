const { Client } = require('pg');
const client = new Client();

const request = [];

function createRequest(mongoId, method, path, endpointId) {
  request.push({
    mongoId,
    method,
    path,
    timestamp: Date.now(),
    endpointId,
  });
}

async function createEndpoint(name) {
  await client.connect();
  client.query('INSERT INTO endpoints (name) VALUES ($1) RETURNING *', [name]);
  await client.end();
}

function getRequest(id) {
  return request[id];
}

module.exports = { createRequest, getRequest , createEndpoint};

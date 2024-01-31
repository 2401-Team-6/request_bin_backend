const { Client } = require('pg');
const request = [];

async function createRequest(mongoId, method, path, endpointId) {
  // pg can not reuse client, stackoverflow tells me to use pool if we dont want to create a new client like this every time
  const client = new Client();

  await client.connect();
  await client.query('INSERT INTO requests (mongo_id, method, path, endpoint_id) VALUES ($1, $2, $3, $4)', [mongoId, method, path, endpointId]);
  await client.end();
}

async function getEndpointId(name) {
  const client = new Client();

  await client.connect();
  const response = await client.query('SELECT id FROM endpoints WHERE name = $1', [name]);
  await client.end();
  return response.rows[0]?.id;
}

async function createEndpoint(name) {
  const client = new Client();

  await client.connect();
  await client.query('INSERT INTO endpoints (name) VALUES ($1) RETURNING *', [name]);
  await client.end();
}

async function getRequests(id) {
  const client = new Client();

  await client.connect();
  const response = await client.query('SELECT mongo_id, method, path FROM requests WHERE endpoint_id = $1', [id]);
  const requests = response.rows.map(row => {
    return ({ id: row.mongo_id, method: row.method, path: row.path });
  });
  return requests;
}

function getRequest(id) {
  return request[id];
}

module.exports = {
  createRequest,
  getRequest ,
  createEndpoint,
  getEndpointId,
  getRequests,
};

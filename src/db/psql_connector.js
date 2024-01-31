const { Client } = require('pg');
const request = [];

async function createRequest(mongoId, method, path, endpointId) {
  const client = new Client();

  await client.connect();
  await client.query(
    'INSERT INTO requests (mongo_id, method, path, endpoint_id) VALUES ($1, $2, $3, $4)',
    [mongoId, method, path, endpointId]
  );
  await client.end();
}

async function getEndpointId(name) {
  const client = new Client();

  await client.connect();
  const response = await client.query(
    'SELECT id FROM endpoints WHERE name = $1',
    [name]
  );
  await client.end();
  return response.rows[0]?.id;
}

async function createEndpoint(name) {
  const client = new Client();

  await client.connect();
  const endpoint = await client.query(
    'INSERT INTO endpoints (name) VALUES ($1) RETURNING *',
    [name]
  );
  await client.end();
  return endpoint.rows[0];
}

async function getRequests(id) {
  const client = new Client();

  await client.connect();
  const response = await client.query(
    'SELECT mongo_id, method, path, created FROM requests WHERE endpoint_id = $1',
    [id]
  );
  const requests = response.rows.map((row) => {
    return {
      id: row.mongo_id,
      method: row.method,
      path: row.path,
      created: row.created,
    };
  });
  return requests;
}

async function deleteRequest(id) {
  const client = new Client();

  await client.connect();
  await client.query('DELETE FROM requests WHERE mongo_id = $1', [id]);
  await client.end();
}

async function deleteAll(id) {
  const client = new Client();

  await client.connect();
  await client.query('DELETE FROM requests WHERE endpoint_id = $1', [id]);
  await client.end();
}

module.exports = {
  createRequest,
  createEndpoint,
  getEndpointId,
  getRequests,
  deleteRequest,
  deleteAll,
};

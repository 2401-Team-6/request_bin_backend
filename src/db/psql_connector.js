const { Pool } = require('pg');

const client = new Pool();

async function createRequest(mongoId, method, path, endpointId) {
  const response = await client.query(
    'INSERT INTO requests (mongo_id, method, path, endpoint_id) VALUES ($1, $2, $3, $4) RETURNING created',
    [mongoId, method, path, endpointId]
  );
  return response.rows[0].created;
}

async function getEndpointId(name) {
  const response = await client.query(
    'SELECT id FROM endpoints WHERE name = $1',
    [name]
  );
  return response.rows[0]?.id;
}

async function getEndpoint(name) {
  const response = await client.query(
    'SELECT * FROM endpoints WHERE name = $1',
    [name]
  );
  return response.rows[0];
}

async function createEndpoint(name) {
  const endpoint = await client.query(
    'INSERT INTO endpoints (name) VALUES ($1) RETURNING *',
    [name]
  );
  return endpoint.rows[0];
}

async function getRequests(id) {
  const response = await client.query(
    'SELECT mongo_id, method, path, created FROM requests WHERE endpoint_id = $1 ORDER BY created DESC',
    [id]
  );
  console.log(response.rows);
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
  await client.query('DELETE FROM requests WHERE mongo_id = $1', [id]);
}

async function deleteAll(id) {
  await client.query('DELETE FROM requests WHERE endpoint_id = $1', [id]);
}

module.exports = {
  createRequest,
  createEndpoint,
  getEndpointId,
  getRequests,
  deleteRequest,
  deleteAll,
  getEndpoint,
};

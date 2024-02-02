const mongo = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';

const client = new mongo.MongoClient(uri);

const database = client.db('requestsDB');
const collection = database.collection('requests');

async function createRequest(headers, body, query, endpoint) {
  let id = '';
  try {

    const doc = {
      headers,
      body,
      query,
      endpoint,
    };

    const result = await collection.insertOne(doc);
    id = result.insertedId.toString();
  } catch (e) {
    console.log(e);
  }
  return id;
}

async function getRequest(id) {
  const objectId = new mongo.ObjectId(id);
  const result = await collection.findOne({ _id: objectId });

  return result;
}

async function deleteRequest(id) {
  const objectId = new mongo.ObjectId(id);
  console.log(objectId);

  await collection.deleteOne({ _id: objectId });
}

function deleteAll(endpoint) {
  collection.deleteMany( { endpoint });
}

module.exports = { createRequest, getRequest, deleteRequest, deleteAll };
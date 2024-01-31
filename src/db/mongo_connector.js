const mongo = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';

const client = new mongo.MongoClient(uri);

async function createRequest(headers, body) {
  let id = '';
  try {
    await client.connect();

    const database = client.db('requestsDB');
    const collection = database.collection('requests');

    const doc = {
      headers,
      body,
    };

    const result = await collection.insertOne(doc);
    id = result.insertedId.toString();
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }

  return id;
}

async function getRequest(id) {
  await client.connect();

  const database = client.db('requestsDB');
  const collection = database.collection('requests');

  const objectId = new mongo.ObjectId(id);

  const result = await collection.findOne({ _id: objectId });

  return result;
}

module.exports = { createRequest, getRequest };

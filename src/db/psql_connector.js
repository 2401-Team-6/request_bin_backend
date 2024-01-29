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

function getRequest(id) {
  return request[id];
}

module.exports = { createRequest, getRequest };

const express = require('express');
const router = express.Router();

const sockets = {};

router.ws('/:name', (ws, req) => {
  const { name } = req.params;

  if (!sockets[name]) {
    sockets[name] = [];
  }
  sockets[name].push(ws);

  console.log(`Connect to ws ${name}: ${sockets[name].length} connections`);

  ws.on('close', () => {
    sockets[name] = sockets[name].filter((socket) => socket !== ws);
    console.log(
      `Disconnect from ws ${name}: ${sockets[name].length} still connected`
    );
  });
});

function messageAll(endpoint, update) {
  if (!sockets[endpoint]) {
    return;
  }

  sockets[endpoint].forEach((ws) => {
    ws.send(JSON.stringify(update));
  });
}

module.exports = { router, messageAll };

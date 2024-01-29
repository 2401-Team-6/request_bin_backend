const express = require('express');
const app = express();
const port = 3000;

app.all('/', (req, res, next) => {
  console.log(req);
  res.status(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

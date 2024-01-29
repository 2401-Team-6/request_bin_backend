const express = require('express');
const app = express();
const port = 3000;

app.use('/log', express.text({ type: '*/*' }));

app.all('/log', (req, res, next) => {
  console.log(req.path, req.method, req.headers, req.body);
  res.status(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

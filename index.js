const app = require('./server/routes.js');
const db = require('./server/db.js');
require('dotenv').config();
const port = process.env.PORT || 3000;

// start server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

//const server =
// server.keepAliveTimeout = 10;
// server.headersTimeout = 11;
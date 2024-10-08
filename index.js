const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World! Crossword game server is up and running.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
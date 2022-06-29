const app = require('./app.jsx').default;

const PORT = process.env.SERVER_PORT || 3002;

app.listen(PORT, () => {
  console.log(`CRA Server Default listening on port ${PORT}!`);
});

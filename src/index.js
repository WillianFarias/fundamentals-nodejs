const express = require("express");
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

customers = [];

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;
  const id = uuid();

  account = {
    id,
    cpf,
    name,
    statement: []
  };

  customers.push(account);

  return response.status(201).json(account)
});

app.listen(3334, () => {
  console.log('Back-end started!')
});
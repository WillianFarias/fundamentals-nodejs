const express = require("express");
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

customers = [];

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  /*const indexCpf = customers.findIndex(account => account.cpf == cpf);
  console.log(indexCpf);
    
  if (indexCpf >= 0) {
    return response.status(400).json('CPF already registered!');
  }*/

  const customerAlreadyExists = customers.some(account => account.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'CPF already registered!' });
  }

  account = {
    id: uuid(),
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
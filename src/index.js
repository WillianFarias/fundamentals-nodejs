const express = require("express");
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

customers = [];

//Middleware
function verifyExistAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const account = customers.find(account => account.cpf === cpf);
  
  if (!account) {
    return response.status(400).json({ error: 'Account not found!' });
  }

  request.account = account;

  return next();
}

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

app.get('/statement', verifyExistAccountCPF, (request, response) => {
  const { account } = request;

  return response.status(200).json(account.statement);
});

app.post('/deposit', verifyExistAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { account } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }

  account.statement.push(statementOperation);

  return response.status(201).json(statementOperation);

});

app.listen(3334, () => {
  console.log('Back-end started!')
});
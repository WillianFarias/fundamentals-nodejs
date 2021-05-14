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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
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

app.get('/statement/date', verifyExistAccountCPF, (request, response) => {
  const { account } = request;
  const { date } = request.query;

  console.log(date);

  const dateFormat = new Date(date + " 00:00");

  const statement = account.statement.filter((statement) => 
  statement.created_at.toDateString() ===
  new Date(dateFormat).toDateString()
  );

  return response.status(200).json(statement);
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

app.post('/withdraw', verifyExistAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { account } = request;

  const balance = getBalance(account.statement);

  if (balance < amount) {
    return response.status(400).json({ error: 'Unsulfent balance!'});
  }

  const statementOperation = {
    description: 'Saque',
    amount,
    created_at: new Date(),
    type: 'debit'
  }

  account.statement.push(statementOperation);

  return response.status(201).json(statementOperation);

});

app.put('/account', verifyExistAccountCPF, (request, response) => {
  const { name } = request.body;
  const { account } = request;

  account.name = name;
  return response.status(201).json(account);
});

app.listen(3334, () => {
  console.log('Back-end started!')
});
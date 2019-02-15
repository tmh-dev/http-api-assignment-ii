const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respond = (request, response, status, type, object) => {
  const headers = {
    'Content-Type': type,
  };

  response.writeHead(status, headers);
  response.write(object);
  console.dir(status);
  response.end();
};

const respondMeta = (request, response, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, 200, 'text/html', index);
};

const getCSS = (request, response) => {
  respond(request, response, 200, 'text/css', style);
};

// function for 404 not found requests with message
const notReal = (request, response) => {
  // create error message for response
  const responseJSON = {
    id: 'notFound',
  };

  if (request.method === 'GET') responseJSON.message = 'The page you are looking for was not found.';

  // return a 404 with an error message
  respond(request, response, 404, 'application/json', JSON.stringify(responseJSON));
};

const notRealMeta = (request, response) => {
  respondMeta(request, response, 404, 'application/json');
};

const getUsers = (request, response) => {
  const responseJSON = {
    message: 'Success',
    users,
  };

  respond(request, response, 200, 'application/json', JSON.stringify(responseJSON));
};

const getUsersMeta = (request, response) => respondMeta(request, response, 200, 'application/json');

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, 'application/json', JSON.stringify(responseJSON));
  }

  let responseCode = 201;

  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, 'application/json', JSON.stringify(responseJSON));
  }

  return respondMeta(request, response, responseCode, 'application/json');
};


module.exports = {
  getIndex,
  getCSS,
  notReal,
  getUsers,
  addUser,
  getUsersMeta,
  notRealMeta,
};

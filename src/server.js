const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responses.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const res = response;
    const body = [];
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      responseHandler.addUser(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') responseHandler.getIndex(request, response);
  else if (parsedUrl.pathname === '/style.css') responseHandler.getCSS(request, response);
  else if (parsedUrl.pathname === '/getUsers') responseHandler.getUsers(request, response);
  else responseHandler.notReal(request, response);
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getUsers') responseHandler.getUsersMeta(request, response);
  else if (parsedUrl.pathname === '/notReal') responseHandler.notRealMeta(request, response);
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') handlePost(request, response, parsedUrl);
  else if (request.method === 'HEAD') handleHead(request, response, parsedUrl);
  else if (request.method === 'GET') handleGet(request, response, parsedUrl);
};

const app = http.createServer(onRequest);

app.listen(PORT);

console.log(`Listening on 127.0.0.1: ${PORT}`);

const fetch = require('node-fetch');

const create = (config) => {
  let baseRequest = {
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Accept' : 'application/json',
      'Content-type' : 'application/json' 
    }
  }
  let request = Object.assign({}, baseRequest, config)

  return {
    'POST': POST(createRequest(request)),
    'GET': GET(createRequest(request)),
    'PUT': PUT(createRequest(request)),
    'DELETE': DELETE(createRequest(request)),
  } 
}

const createRequest = baseRequest => (method, data) => {

  let request = Object.create(baseRequest) 
  request.method = method;

  switch(method) {
    case 'get':
      request.url
      break;
    case 'post':
    case 'put':
      request.body = JSON.stringify(data)
      break
  }

  return request;

}

const GET = requestCreator => (url, data) => {
  return executeRequest({request: requestCreator('get'), url: url + parseObjectToQueryParam(data)})
}

const POST = requestCreator => (url, data) => {
  return executeRequest({request: requestCreator('post', data), url: url})
}

const PUT = requestCreator => (url, data) => {
  return executeRequest({request: requestCreator('put', data), url: url})
}

const DELETE = requestCreator => (url, data) => {
  return executeRequest({request: requestCreator('delete', data), url: url})
}

const executeRequest = (params) => {
  
  return fetch(params.url, params.request)
    .then(response => {
      return response.json()
        .then(json => ({data: json, status: response.status, url: response.url }) )
    })
    .then(requestDone)
    .catch(requestError)
}

const requestDone = (request) => {

  switch(request.status) {
    case 400:
    case 404:
    case 500:
    case 403:
      return Promise.reject(request)
  }

  return Promise.resolve(request)

}

// Global error handler
// Used for reports, global popups and so on
const requestError = (err) => {
  return Promise.reject(err)
}


// Transforms a JSON to query parameter
const parseObjectToQueryParam  = (json) => {
  let a = '?';
  
  for(var key in json) {
    a += (a != '?' ? '&' : '') + key + '=' + json[key]
  }
  return a;
}

module.exports = create;

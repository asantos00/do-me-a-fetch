let fetch;

const create = ({
  config = {}, 
  injectedFetch, 
  onError = () => ({}), 
  onStart = () => ({}), 
  onFinish = () => ({})
}) => {
  
  fetch = injectedFetch; 
  let baseRequest = {
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Accept' : 'application/json',
      'Content-type' : 'application/json' 
    }
  }
  let request = Object.assign({}, baseRequest, config)


  const GET = requestCreator => (url, data) => {
    return executeRequest({request: requestCreator('get'), url: url + parseObjectToQueryParam(data), onError: onError, onStart: onStart, onFinish: onFinish})
  }

  const POST = requestCreator => (url, data) => {
    return executeRequest({request: requestCreator('post', data), url: url, onError: onError, onStart: onStart, onFinish: onFinish})
  }

  const PUT = requestCreator => (url, data) => {
    return executeRequest({request: requestCreator('put', data), url: url, onError: onError, onStart: onStart, onFinish: onFinish})
  }

  const DELETE = requestCreator => (url, data) => {
    return executeRequest({request: requestCreator('delete', data), url: url, onError: onError, onStart: onStart, onFinish: onFinish})
  }

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

const executeRequest = (params) => {
  params.onStart(params)
  return fetch(params.url, params.request)
    .then(response => {
      return response.json()
        .then(json => ({data: json, status: response.status, url: response.url }) )
    })
    .then(requestDone)
    .catch(params.onError)
}

const requestDone = (request) => {

  switch(request.status) {
    case 400:
    case 404:
    case 500:
    case 403:
      return Promise.reject(request)
  }

  return Promise.resolve(request.data)

}

// Default error handler
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

export default create
/*
const instance = create({config: {}, injectedFetch: window.fetch})

export const POST = instance.POST
export const GET = instance.GET
export const PUT = instance.PUT
export const DELETE = instance.DELETE
*/


var create = require('./index.js')

create().POST('http://jsonplaceholder.typicode.com/posts/1')
  .then(resp => console.log(resp))
  .catch(err => console.log(err))

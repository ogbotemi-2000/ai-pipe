let db    =  require('../utils/db'),
   path   = require('path'),
   fs     = require('fs'),
   file   = path.join(require('../utils/rootDir')(__dirname), './config.json'),
   config = fs.existsSync(file)&&require(file)||{...process.env};

module.exports = async function(request, response) {

  let { input, model } = request.body||=await new Promise(resolve=>{
    let buffer = [];
    request.on('data', chunk=>buffer.push(chunk)),
    request.on('end', function(data) {
      if(!buffer.length) return;
      data = Buffer.concat(buffer).toString('utf-8'),
      resolve(parseMultipart(request, data))
    })
  }), query = `SELECT pgml.embed('$1', '$2');`;
  console.log([model, input]),
  [model, input].forEach(arg=>query=query.replace(/\$[0-9]/, arg)),
  db({ isMySQL:0, connectionString: config.DB_URL })
  .then(drv=>{
    drv.query(query).then(res=>{
      response.json({ data:[{ embedding: res.rows[0].embed }] })
    })
  })
  .catch(err=>{
      console.log('::ERROR::', err)
  })
}



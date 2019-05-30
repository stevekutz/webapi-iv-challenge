// GOES FIRST !!!!!!!!!!!!
require('dotenv').config();

// code away! 
// IMPORTS server.js



const server = require('./server.js');
// make port DYNAMIC
const port = process.env.PORT || 4008;



server.listen(port, () => {
    console.log(`\n Server running on http://localhost:${port} \n`);
  });

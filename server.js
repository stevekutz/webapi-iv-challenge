const express = require('express');  // creates express app !!!
const helmet = require('helmet');  // hides headers 
const logger = require('morgan');  // logger thingy



// ADD this here and start building postRouter.js
const PostsRouter = require('./posts/postRouter');
const UsersRouter = require('./users/userRouter');



const server = express();

// *******-> GLOBAL MIDDLEWARE(declared up top here)
//* this is built-in middleware !!!
server.use(express.json());    // allows reading / parses req.body !!!!



// @@@@@@@->  third-party-middleware
server.use(helmet());
// >>> morgan pre-define formats: combined, common, dev, short, tiny
//server.use(logger('short')); // include parameter for logging display option
server.use(logger('dev'));


//#######->  custom middleware
server.use(myLogger);


// Postsrouter endpoint called out
// server.use('api/posts', PostsRouter);  // Noooooo, not this.....
server.use('/posts', PostsRouter);    // but this.....
server.use('/users', UsersRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Routes and custom middleware !</h2>`)
});





//   custom middleware callbacks definitions
// myLogger
function myLogger(req, res, next){
  
 //  console.log('### req', req);
  console.log(
    ` >>> a ${req.method} method Requesteeee was made 
      >>> from url  ${req.url} 
      >>> at ${new Date().toISOString()}  from myLogger`);
  next(); // MUST be called in order to let "next" middlewqware(e.g. morgan) continue
};

// myValidateUserId
async function myValidateUserId(req, res, next){
  try {
    const {id} = req.params;   // makes id    same as req.params.id 
    // const post = await Posts.findById(id);   // find existing post id
    const user = await Posts.findById(id);   // find existing post id
      
    if(post) {
        req.post = post;   // attach post to req if it exists
        next();     // don't forget to let other middleware do its thing also
      } else {
        res.status(404).json({
          message: `Hub not found, ${id} is an invalid id`
        });
      }
    } catch (error) {
        res.status(500).json({ message: 'Failed to process request'});
    } 
};

module.exports = server;

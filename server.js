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


//#######->  custom local middleware
server.use(myLogger);
server.use(addName);

// Postsrouter endpoint called out
// server.use('api/posts', PostsRouter);  // Noooooo, not this.....
server.use('/posts', PostsRouter);    // but this.....
server.use('/users', UsersRouter);


server.get('/', async (req, res) => {

  try{
    const shoutouts = await db('shoutouts');
    const nameInsert = (req.name ? `${req.name}` : '');  // NEWLY ADDED, middle will help!!!

    res.status(200).json({
      messageOfTheDay: process.env.MOTD,
      shoutouts,
    });

    res.send(`<h2>Routes and custom middleware !</h2>
      <h2>Lambda Hubs API</h2>
      <p>Welcome ${nameInsert} to the Lambda Hubs API</p>      
    `);

  } catch (error) {
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot retrieve the shoutouts' });
  }


});

server.post('/', async (req, res) => {
  try {
    const [id] = await db('shoutouts').insert(req.body);
    const shoutouts = await db('shoutouts');

    res.status(201).json(shoutouts);
  } catch (error) {
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot add the shoutout' });
  }
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


/// some extra custome middleware
function addName(req, res, next) {
  req.name = req.name || "future wife Allison";
  next();
};



module.exports = server;

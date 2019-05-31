//const express = 'express';   ///???
 const express = require('express');   // this should replace above line



const Posts = require('./postDb.js');
// const Users = require('../users/userDb.js');   // split this into userRouter

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
    try {
        //const posts = await Posts.get(req.query);   // no arg in postDb !!!
        const posts = await Posts.get();
        res.status(200).json(posts);
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the posts',
        });
      }
});

// GET by id
router.get('/:id', async (req, res) => {
    try {
      const post = await Posts.getById(req.params.id);
  
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the post',
      });
    }
  });

  // ADD new post   // WANTS a 'user_id' field in body as well as 'text'
  router.post('/', validatePost, async (req, res) => {
    
    const newPost = req.body;  

      try {
        const post = await Posts.insert(newPost);    // looked in postDb.js to see that 'insert' needed
        res.status(201).json(newPost);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: 'There was an error while saving the post to the database',
        });
      }
 
    
});




// DELETE specific post with id
  router.delete('/:id', async (req, res) => {
    
    const {id} = req.params; // makes id    same as req.params.id
    
    
    try {
      const count = await Posts.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: 'The post has been nuked' });
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: `Error removing post ${id}`
      });
    }
  });

// UPDATE specific post with id  
router.put('/:id', validatePost, validatePostId, async (req, res) => {
    const updatedPost = req.body; 
    const {id} = req.params; // makes id    same as req.params.id

    try {
        //    const postUpdate = await Posts.update(req.params.id, req.body);
            const postUpdate = await Posts.update(id, updatedPost);
            
            if (postUpdate) {
                res.status(200).json(postUpdate);
            } else {
                res.status(404).json({ 
                    message: 'The post with the specified id does not exist.' 
                });
            }
            } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error updating the post',
            });
            }
});

// custom middleware

async function validatePostId(req, res, next) {
    try {
        const {id} = req.params;   // makes id    same as req.params.id 
        const post = await Posts.getById(id);   // find existing post id
          
        if(post) {
            req.post = post;   // attach hub to req if it exists
            next();     // don't forget to let other middleware do its thing also
          } else {
            res.status(404).json({
              message: `yo yo yo, POST not found, dat ${id} is an invalid id`
            });
          }
        } catch (error) {
            res.status(500).json({ message: 'Failed to process request'});
        } 
};

//  goes on post & put 
function validatePost(req, res, next) {
     // we want to check the body is defined and not an empty object
  // otherwise respond with status 400 and a useful message

    // is defined  AND not empty(keys exist) 
  if(req.body && Object.keys(req.body).length){
    // #### All good, go to next middleware
    next();
  } else {
    res.status(400).json({
        message: "missing required text field"
      })
  }
};


module.exports = router;
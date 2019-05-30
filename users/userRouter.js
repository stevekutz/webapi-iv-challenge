// const express = 'express';
const express = require('express');   // this should replace above line


const Users = require('./userDb.js');


const router = express.Router();

// ADD new user 
router.post('/', validateUser, async (req, res) => {
    try {
        const user = await Users.insert(req.body);
        res.status(201).json(user);
      } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
          message: 'Error adding the user',
        });
      }
});

// ADD user post    !!!!  Something not working SQLite error about text
router.post('/:user_id/posts', validateUserId ,async (req, res) => {
    const postInfo = { ...req.body, user_id: req.params.user_id };

    try {
      const post = await Users.insert(postInfo);
      res.status(210).json(post);
    } catch (error) {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the post for the user',
      });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.get();
        res.status(200).json(users);
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the posts',
        });
      }

});

router.get('/:user_id', validateUserId, async (req, res) => {
    try {
      const user = await Users.getById(req.params.user_id);
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `NOT SEEN with id ${id} not found` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Error retrieving the user`,
      });
    }
  });

router.get('/:user_id/posts', validateUserId, async (req, res) => {
    const {user_id} = req.params;

    try{
        const posts = await Users.getUserPosts(user_id);

        if(posts.length) {
            res.json(posts);
        } else {
            res.status(404).json({
                err: "no posts for this user"
            })
        }
    } catch(err) {
        res.status(500).json({err});
    }
});

router.delete('/:user_id', validateUserId, async (req, res) => {
    try {
        const count = await Users.remove(req.params.user_id);
        if (count > 0) {
          res.status(200).json({ message: 'The user has been nuked' });
        } else {
          res.status(404).json({ message: 'The user could not be found' });
        }
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error removing the user',
        });
      }
});

router.put('/:user_id', validateUserId, validateUser ,async (req, res) => {
    try {
        const userPost = req.body;
        const post = await Users.update(req.params.user_id, req.body);
        if (post) {
          res.status(200).json(userPost);  // userPost returns updated body
        } else {
          res.status(404).json({ message: `The post with ${user_id} could not be found` });
        }
      } catch (error) {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: 'Error updating the post',
        });
      }
});

//custom middleware
async function validateUserId(req, res, next) {
    try {
        const {user_id} = req.params;   // makes id    same as req.params.id 
        const user = await Users.getById(user_id);   // find existing user id
          
        if(user) {
            req.user = user;   // attach hub to req if it exists
            next();     // don't forget to let other middleware do its thing also
          } else {
            res.status(400).json({
              message: `YO DUDE, User not found, ${user_id} is an invalid id`
            });
          }
        } catch (error) {
            res.status(500).json({ message: 'Failed to process request'});
        } 
};

//  goes on post & put 
function validateUser(req, res, next) {
     // we want to check the body is defined and not an empty object
     // otherwise respond with status 400 and a useful message

    // is defined  AND not empty(keys exist) 
    if(req.body && Object.keys(req.body).length){
        // #### All good, go to next middleware
        next();
      } else {
        res.status(400).json({
            message: "ERROR DUDE, missing required name field"
          })
      }
};

// I put this one in postRouter cause that where it belongs
function validatePost(req, res, next) {

};

module.exports = router;

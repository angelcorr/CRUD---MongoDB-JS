const express = require('express');
const mongoose = require('mongoose');

const User = require('../../../../models/User');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    const post = user.posts.find(post => post.id === req.params.postId);
    if (!post) {
      res.status(404).send('This post does not exist');
      return;
    }

    const newCount = (post.likes || 0) + 1;
    user.posts = user.posts.map(currentPost =>
      (currentPost.id === post.id ? { ...currentPost.toObject(), likes: newCount } : currentPost));

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

module.exports = router;

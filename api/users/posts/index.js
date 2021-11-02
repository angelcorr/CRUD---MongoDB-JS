const express = require('express');
const mongoose = require('mongoose');

const User = require('../../../models/User');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    
    user.posts.push(req.body);
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
    
    res.status(500).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send('This user does not exist');
      return;
    }

    res.send(user.posts.map(post => ({ userId: user.id, ...post.toObject() })));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:postId', async (req, res) => {
  console.log('llega', req.body);
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

    res.send({ userId: user.id, ...post.toObject() });
  } catch (error) {
    res.status(500).send(error);
  }
});

const patchAndPutHandler = async (req, res) => {
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

    user.posts = user.posts.map(currentPost =>
      (currentPost.id === post.id ? { ...currentPost.toObject(), ...req.body } : currentPost));

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
}

router.patch('/:postId', patchAndPutHandler);

router.put('/:postId', patchAndPutHandler);

router.delete('/:postId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      return;
    }

    const post = user.posts.find(post => post.id === req.params.postId);
    if (!post) {
      res.status(404).send('This post does not exist');
      return;
    }

    user.posts = user.posts.filter(currentPost => currentPost.id !== post.id);

    await user.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

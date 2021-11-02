const express = require('express');
const mongoose = require('mongoose');
const posts = require('./posts');
const User = require('../../models/User');
const router = express.Router({ mergeParams: true });

// * POST   /api/users                 -> Creates a new user
// * GET    /api/users                 -> Get all users
// * GET    /api/users/:id             -> Get an user given its id
// * PATCH  /api/users/:id             -> Changes an user given its id
// * PUT    /api/users/:id             -> Replaces an user given its id
// * DELETE /api/users/:id             -> Deletes an user given its id

router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    await User.create(req.body);
    res.sendStatus(201);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send(error);
    }

    res.status(500).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    res.send(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  console.log('lo que llega', req.body);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }


});

router.patch('/:id', async (req, res) => {
  try {
    await User.updateOne({ id: req.params.id }, req.body, { runValidators: true });
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send(error);
      return;
    }
    console.log(error);
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res) => {
  console.log(req.body);
  try {
    if (!Object.keys(req.body).includes('username')
      || !Object.keys(req.body).includes('email')
      || !Object.keys(req.body).includes('password')) {
      res.status(400).send({ errorMessage: 'You must include all fields' });
    }

    await User.updateOne({ id: req.params.id }, req.body, { runValidators: true });
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send(error);
      return;
    }

    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    await User.deleteOne({ id: req.params.id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.use('/:id/posts', posts);

module.exports = router;

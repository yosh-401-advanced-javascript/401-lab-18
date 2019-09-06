'use strict';

const express = require('express');
const apiRouter = express.Router();

const User = require('./model/user.js');
const Article = require('./model/article.js');
const auth = require('./middleware/auth.js');
const oauth = require('./oauth/google.js');
// const Thing = require('./model/thing.js');

/**
 * Authentication router to create a user
 * @param POST
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
apiRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save().then((user) => {
    req.token = user.generateToken(user.role);
    req.user = user;
    res.set('token', req.token);
    res.cookie('auth', req.token);
    res.send(req.token);
  }).catch(next);
});
/** Authentication router to sign in
* @param POST
* @param {object} req
* @param {object} res
* @param {function} next
*/
apiRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send({user: req.user, token: req.token});
});

/* * Authentication router to post
* @param GET
* @param {object} req
* @param {object} res
* @param {function} next
*/
apiRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req).then(token => {
    res.status(200).send(token);
  }).catch(next);
});


/** Authentication router to create a key
* @param POST
* @param {object} req
* @param {object} res
* @param {function} next
*/
apiRouter.post('/key', auth(), (req, res, next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

/** Authentication router to create a new article
 * @param POST
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
apiRouter.post('/article', auth('create'), (req, res, next) => {
  let article = new Article(req.body);
  article.save().then(article => {
    res.status(200);
    res.send(article);
  }).catch(next);
});

/** Authentication router to create new thing
 * @param POST
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
apiRouter.post('/thing', auth('create'), (req, res, next) => {
  let thing = new Thing(req.body);
  thing.save().then(thing => {
    res.status(200);
    res.send(thing);
  }).catch(next);
});

/** Authentication router to get the path to /public-stuff
 * @param POST
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
apiRouter.get('/public-stuff', auth, (req, res, next) => {
  oauth.authorize(req).then(token => {
    res.status(200).send(token);
  }).catch(next);
});

module.exports = apiRouter;
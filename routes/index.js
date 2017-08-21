var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', (req, res, next) => {
	knex('posts').join('users', 'posts.user_id', '=', 'users.id').join('topics', 'posts.topic_id', '=', 'topics.id').select('posts.*', 'users.username', 'topics.topic')
		.then(posts => {
			res.render('index', {posts: posts, cookies: req.cookies.user_id});
		});
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  var un = req.body.un;
  var pw = req.body.pw;
  knex.select().from('users').where({username: un})
  	.then(user => {
  		bcrypt.compare(pw, user[0].password, (err, resp) => {
  			if (resp) {
  				res.cookie('user_id', user[0].id);
					res.redirect('/');
  			} else {
  				res.send('try again');
  			}
  		})
  	});
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('user_id');
	res.redirect('/');
});

module.exports = router;

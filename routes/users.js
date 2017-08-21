var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bcrypt = require('bcrypt');


router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/new', (req, res, next) => {
  res.render('../views/users/new_user');
});

router.get('/:id', (req, res, next) => {
  knex('users').where({id: req.params.id})
  	.then(user => {
  		knex.raw(`SELECT users.*, posts.id as post_id, posts.title, posts.body FROM users JOIN posts on users.id = posts.user_id WHERE users.id = ${req.params.id}`)
  			.then(posts => {
  				res.render('../views/users/show_user', {user: user[0], posts: posts.rows, cookies: req.cookies.user_id})
  			})
  	});
});

router.get('/:id/edit', (req, res, next) => {
	if (req.params.id === req.cookies.user_id) {
		knex('users').where({id: req.params.id})
  	.then(user => {
  		res.render('../views/users/edit_user', {user: user[0], cookies: req.cookies.user_id})
  	});
	} else {
		res.send('can\'t edit another users account')
	}
});

router.post('/', (req, res, next) => {
	var user = req.body;
	if (user.pw === user.cpw) {
		bcrypt.hash(user.pw, 8).then(hash => {
			knex('users').insert({username: `${user.un}`, email: `${user.em}`, password: `${hash}`})
				.then(user => {
					res.redirect('/');
				});
		});
	} else {
  	res.send('passwords do not match');
  }
});

router.post('/:id', (req, res, next) => {
	var user = req.body;
	knex('users').where({id: req.params.id})
		.update({username: `${user.un}`,
						email: `${user.em}`})
		.then(users => {
			res.redirect(`/users/${req.params.id}`);
		});
});

router.post('/:id/delete', function(req, res, next) {
	knex('users').where({id: req.params.id}).del()
		.then(user => {
			res.clearCookie('user_id');
			res.redirect('/')
		})
});

module.exports = router;

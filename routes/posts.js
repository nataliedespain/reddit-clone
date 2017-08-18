var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');


router.get('/', (req, res, next) => {
	knex('posts').join('users', 'posts.user_id', '=', 'users.id')
		.then(posts => {
			res.render('../views/posts/posts', {posts: posts});
		});
});

router.get('/new', (req, res, next) => {
	if (req.cookies.user_id) {
		res.render('../views/posts/new_post', {cookies: req.cookies.user_id});
	} else {
		res.send('need to be logged in to create post');
	}
});

router.get('/:id', (req, res, next) => {
  knex.raw(`SELECT posts.*, users.username, topics.topic FROM posts JOIN users ON posts.user_id = users.id JOIN topics ON topics.id = posts.topic_id WHERE posts.id = 1`)
  	.then(post => {
			res.render('../views/posts/show_post', {post: post.rows[0]});
		});
});

router.get('/:id/edit', (req, res, next) => {
	knex('posts').where({id: req.params.id})
		.then(post => {
			res.render('../views/posts/edit_post', {post: post[0]});
		});
});

router.post('/', (req, res, next) => {
	var post = req.body;
	knex('posts').insert({title: post.title, body: post.body, topic_id: post.topic, user_id: req.cookies.user_id})
		.then(post => {
			res.redirect('/posts');
		});
});

router.post('/:id', (req, res, next) => {
	var post = req.body;
	knex('posts').where({id: req.params.id}).update({title: post.title, body: post.body, topic_id: post.topic})
		.then(post => {
			res.redirect(`/posts/${req.params.id}`);
		});
});

router.post('/:id/delete', function(req, res, next) {
	
});

module.exports = router;

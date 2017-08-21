var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');


router.get('/', (req, res, next) => {
	knex('posts').join('users', 'posts.user_id', '=', 'users.id').join('topics', 'posts.topic_id', '=', 'topics.id').select('posts.*', 'users.username', 'topics.topic')
		.then(posts => {
			res.render('../views/posts/posts', {posts: posts, cookies: req.cookies.user_id});
		});
});

router.get('/new', (req, res, next) => {
	if (req.cookies.user_id) {
		knex.select().from('topics')
			.then(topics => {
				res.render('../views/posts/new_post', {topics: topics, cookies: req.cookies.user_id});
			});
	} else {
		res.send('need to be logged in to create post');
	}
});

router.get('/:id', (req, res, next) => {
  knex.raw(`SELECT posts.*, users.username, topics.topic FROM posts JOIN users ON posts.user_id = users.id JOIN topics ON topics.id = posts.topic_id WHERE posts.id = ${req.params.id}`)
  	.then(post => {
  		knex('comments').join('users', 'comments.user_id', '=', 'users.id').select('comments.*', 'users.username').where({post_id: req.params.id})
  		.then(comments => {
  			res.render('../views/posts/show_post', {post: post.rows[0], comments: comments, cookies: req.cookies.user_id});
  		});
		});
});

router.get('/:id/edit', (req, res, next) => {
	knex('posts').where({id: req.params.id})
		.then(post => {
			knex.select().from('topics')
				.then(topics => {
					res.render('../views/posts/edit_post', {post: post[0], topics: topics, cookies: req.cookies.user_id});
				})
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
	knex('posts').where({id: req.params.id}).del()
		.then(user => {
			res.clearCookie('user_id');
			res.redirect('/')
		})
});


// COMMENTS 
router.get('/:id/comments/:cid/edit', (req, res, next) => {
	knex('comments').where({id: req.params.cid})
		.then(comment => {
			res.render('../views/posts/edit_comment', {comment: comment[0], cookies: req.cookies.user_id});
		});
});

router.post('/:id/comments', (req, res, next) => {
	var com = req.body;
	knex('comments').insert({body: com.body, post_id: req.params.id, user_id: req.cookies.user_id})
		.then(comment => {
			res.redirect(`/posts/${req.params.id}`);
		});
});

router.post('/:id/comments/:cid', (req, res, next) => {
	var com = req.body;
	knex('comments').where({id: req.params.id}).update({body: com.body})
		.then(comment => {
			res.redirect(`/posts/${req.params.id}`);
		});
});

router.post('/:id/comments/:cid/delete', (req, res, next) => {
	knex('comments').where({id: req.params.cid}).del()
		.then(comment => {
			res.redirect(`/posts/${req.params.id}`);
		});
});

module.exports = router;

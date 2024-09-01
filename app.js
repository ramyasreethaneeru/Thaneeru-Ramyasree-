// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Blog post schema and model
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-post.html'));
});

app.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'post.html'));
});

app.post('/posts', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save((err) => {
        if (err) {
            res.send('Error saving post');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) {
            res.send('Error fetching posts');
        } else {
            res.json(posts);
        }
    });
});

app.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            res.send('Error fetching post');
        } else {
            res.json(post);
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

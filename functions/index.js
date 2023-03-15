const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();
const db = admin.firestore();

const API_PREFIX = 'api';
const app = express();

// Rewrite Firebase hosting requests: /api/:path => /:path
app.use((req, res, next) => {
    if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
        req.url = req.url.substring(API_PREFIX.length + 1);
    }
    next();
});

app.get('/posts', async (req, res) => {
    const snapshot = await db.collection('posts').get();

    const posts = [];
    snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();

        posts.push({id, ...data});
    });

    res.status(200).send(JSON.stringify(posts));
});

app.get('/posts/:id', async (req, res) => {
    const snapshot = await db.collection('posts').doc(req.params.id).get();

    if (!snapshot.exists) res.status(404).send({ error: 'Post not available.' });

    const postId = snapshot.id;
    const postData = snapshot.data();

    res.status(200).send(JSON.stringify({ id: postId, ...postData }));
})

exports[API_PREFIX] = functions.https.onRequest(app);

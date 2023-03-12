import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import * as Cache from './cache';
import { IPost, IUser } from './pages/main';
import { Timestamp } from 'firebase/firestore';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// Load cache from local storage

console.log('Loading cache from local storage')

const userCache = localStorage['user_cache'];
const postCache = localStorage['post_cache'];

if (userCache) {
    console.log('Found user cache from local storage');
    Cache.setUserCache(new Map(JSON.parse(userCache).map((user: IUser) => [user.id, user])));
}
if (postCache) {
    console.log('Found post cache from local storage')
    Cache.setPostCache(new Map(JSON.parse(postCache).map((post: IPost) => [post.id, {
        ...post,
        createdAt: new Timestamp(post.createdAt.seconds, post.createdAt.nanoseconds),
    }])));
}   

root.render(
    <App />
);
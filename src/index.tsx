import ReactDOM from 'react-dom/client';
import App from './app';
import * as Cache from './cache';
import { IUser } from './pages/main';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// Load cache from local storage

console.log('Loading cache from local storage')

const userCache = localStorage['user_cache'];

if (userCache) {
    console.log('Found user cache from local storage');
    Cache.setUserCache(new Map(JSON.parse(userCache).map((user: IUser) => [user.id, user])));
}

root.render(
    <App />
);
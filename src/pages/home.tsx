import { collection, limitToLast, orderBy, query, Timestamp } from 'firebase/firestore';
import { Timeline } from '../components/timeline';
import { db } from '../config/firebase';

export interface IUser {
    id: string;
    displayName: string;
}

export interface IPost {
    id: string;
    userId: string;
    content: string;
    createdAt: Timestamp;
}

export const Home = () => {
    return (
        <div className='home'>
            <Timeline query={query(collection(db, 'posts'), orderBy('createdAt', 'asc'), limitToLast(10))} />
        </div>
    );
};
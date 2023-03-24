import { collection, limitToLast, orderBy, query, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ComposeBox } from '../components/composebox';
import { Timeline } from '../components/timeline';
import { auth, db } from '../config/firebase';

export interface IUser {
    id: string;
    displayName: string;
}

export interface IPost {
    id: string;
    userId: string;
    content: string;
    mediaPaths: string[];
    createdAt: Timestamp;
}

export const Home = () => {
    const [ user ] = useAuthState(auth);

    return (
        <div className='home'>
            {user && <ComposeBox />}
            <Timeline query={query(collection(db, 'posts'), orderBy('createdAt', 'asc'), limitToLast(10))} />
        </div>
    );
};
import { collection, limitToLast, onSnapshot, orderBy, query, QuerySnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Post } from '../components/post';
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

export const Main = () => {
    const [timeline, setTimeline] = useState<IPost[]>([]);
    
    const addPostToTimeline = (post: IPost) => setTimeline((prev) => {
        const index = prev.findIndex((p) => p.id === post.id);
        if (index === -1) return [ post, ...prev ];
        
        prev[index] = post;
        return prev;
    });
    const removePostFromTimeline = (id: string) => setTimeline((prev) => prev.filter((post) => post.id !== id));

    useEffect(() => {
        const handleTimelineChanges = (snapshot: QuerySnapshot) => snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified')
                addPostToTimeline({...change.doc.data(), id: change.doc.id } as IPost);
            if (change.type === 'removed')
                removePostFromTimeline(change.doc.id);
        });

        const postQuery = query(collection(db, 'posts'), orderBy('createdAt', 'asc'), limitToLast(10));
        const unsubscribe = onSnapshot(postQuery, handleTimelineChanges, err => console.log(err));

        return () => unsubscribe();
    }, [])

    const sortByCreationDate = (x: IPost, y: IPost) => y.createdAt.toMillis() - x.createdAt.toMillis();

    return (
    <div className='main'>
        <div className='posts'>
            {timeline
                .sort(sortByCreationDate)
                .map((post) => <Post key={post.id} post={post}/>)}
        </div>
    </div>
    );
}
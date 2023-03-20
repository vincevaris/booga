import { onSnapshot, Query, QuerySnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IPost } from '../pages/home';
import { Post } from './post';

interface Props {
    query: Query;
}

export const Timeline = (props: Props) => {
    const { query } = props;
    const [posts, setPosts] = useState<IPost[]>([]);

    const addPost = (post: IPost) => setPosts((prev) => {
        const index = prev.findIndex((p) => p.id === post.id);
        if (index === -1) return [ post, ...prev ];
        
        prev[index] = post;
        return prev;
    });
    const removePost = (id: string) => setPosts((prev) => prev.filter((post) => post.id !== id));

    useEffect(() => {
        const handleChanges = (snapshot: QuerySnapshot) => {
            if (snapshot.metadata.hasPendingWrites) return;
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified')
                    addPost({...change.doc.data(), id: change.doc.id } as IPost);
                if (change.type === 'removed')
                    removePost(change.doc.id);
            });
        };

        const unsubscribe = onSnapshot(query, handleChanges, err => console.log(err));

        return () => unsubscribe();
    }, []);

    const sortByCreationDate = (x: IPost, y: IPost) => y.createdAt.toMillis() - x.createdAt.toMillis();

    return (
        <div className="timeline">
            {posts
                .sort(sortByCreationDate)
                .map((post) => <Post key={post.id} post={post}/>)}
        </div>
    );
};